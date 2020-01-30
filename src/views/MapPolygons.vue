<template>
  <v-container>
    <v-card flat class="pt-4" id="map" min-height="70vh">
    </v-card>
    <v-row class="justify-space-around align-end">
      <v-card flat class="pa-4" max-width="220px">
        <v-radio-group v-model="addPolygonType" :disabled="!!deleteActivated || !!editActivated">
          <v-radio label="Service available" value="ServiceAvailable" color="#A00E0D" />
          <v-radio label="Build commenced" value="BuildCommenced"/>
        </v-radio-group>
        <v-btn :disabled="!(addingPolygonId && addPolygonType)" color="success" @click="createPolygon" width="100%">Add polygon</v-btn>
      </v-card>
      <v-card flat class="pa-4" max-width="220px">
        <v-checkbox v-model="editActivated" label="Activate edit mode" value="active" :disabled="!!deleteActivated || !!addPolygonType" />
        <v-btn :disabled="!(editActivated)" color="warning" width="100%" @click="editPolygon">Edit polygon</v-btn>
      </v-card>
      <v-card flat class="pa-4" max-width="220px">
        <v-checkbox v-model="deleteActivated" label="Activate delete mode" value="active" :disabled="!!editActivated || !!addPolygonType" />
        <v-btn :disabled="!(deleteActivated)" color="error" width="100%" @click="deletePolygon">Delete polygon</v-btn>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable no-console */

import { mapGetters } from 'vuex'

import mapConfigs from '@/configs/map'

export default {
  data() {
    return {
      place: { lat: -37.85701362, lng: 144.963058 },

      addPolygonType: '',
      editActivated: '',
      deleteActivated: '',

      addingPolygonId: 0,

      addPolygon: [],

      editedPolygonAvail: {},
      editedPolygonCommenced: {},
      editedPolygonBufferAvail: null,
      editedPolygonBufferCommenced: null,

      deletedPolygonAvail: '',
      deletedPolygonCommenced: '',
      deletedPolygonBufferAvail: null,
      deletedPolygonBufferCommenced: null,

      serverPolygonsAvailable: {},
      serverPolygonsCommenced: {},

      structureToSend: {
        type: 'FeatureCollection',
        features: [],
      },
    }
  },

  computed: {
    ...mapGetters({
      endpoint: 'map/polygonsEndpoint',
    }),

  },

  methods: {
    initMap() {
      const map = new window.google.maps.Map(document.querySelector('#map'), {
        center: this.place,
        zoom: 13,
        styles: mapConfigs,
      })

      const state = new window.google.maps.Data()
      state.loadGeoJson(this.endpoint)

      const addListenersOnPolygonForEdit = (polygon, id, typeOf) => {
        window.google.maps.event.addListener(polygon, 'click', () => {
          if (this.editActivated) {
            const coordinates = polygon.getPath().getArray()
            const coordArr = []
            coordinates.forEach((elem) => {
              coordArr.push([
                elem.lng(),
                elem.lat(),
              ])
            })
            polygon.setOptions({
              fillColor: '#FF6F00',
              strokeColor: '#FF6F00',
              editable: true,
            })
            if (typeOf === 'ServiceAvailable' && JSON.stringify(coordArr) !== JSON.stringify(this.serverPolygonsAvailable[id])) {
              this.editedPolygonAvail[id] = coordArr
              this.editedPolygonBufferAvail = polygon
              console.log('ServiceAvailable has been changed')
            } else if (typeOf === 'BuildCommenced' && JSON.stringify(coordArr) !== JSON.stringify(this.serverPolygonsCommenced[id])) {
              this.editedPolygonCommenced[id] = coordArr
              this.editedPolygonBufferCommenced = polygon
              console.log('BuildCommenced has been changed')
            }
          }
        })
      }

      const addListenersOnPolygonForDelete = (polygon, id, typeOf) => {
        window.google.maps.event.addListener(polygon, 'click', () => {
          if (this.deleteActivated) {
            if (typeOf === 'ServiceAvailable' && id === Object.keys(this.serverPolygonsAvailable).find(key => key === id)) {
              this.deletedPolygonAvail = id
              this.deletedPolygonBufferAvail = polygon
              console.log('ServiceAvailable has been removed')
            } else if (typeOf === 'BuildCommenced' && id === Object.keys(this.serverPolygonsCommenced).find(key => key === id)) {
              this.deletedPolygonCommenced = id
              this.deletedPolygonBufferCommenced = polygon
              console.log('BuildCommenced has been removed')
            }
          }
        })
      }

      let avail = null
      let build = null
      state.addListener('addfeature', (e) => {
        if (e.feature.getProperty('typeOf') === 'ServiceAvailable') {
          avail = e.feature.getGeometry()
          const typeOf = e.feature.getProperty('typeOf')
          const paths = avail.getAt(0).getArray()
          const id = e.feature.getProperty('id')
          const currentPath = paths.map(elem => [elem.lng(), elem.lat()])
          this.serverPolygonsAvailable[id] = currentPath
          const p = new window.google.maps.Polygon({
            paths,
            map,
            fillColor: '#A00E0D',
            strokeColor: '#A00E0D',
            strokeWeight: 0.5,
            clickable: true,
          })
          addListenersOnPolygonForEdit(p, id, typeOf)
          addListenersOnPolygonForDelete(p, id, typeOf)
        } else {
          build = e.feature.getGeometry()
          const typeOf = e.feature.getProperty('typeOf')
          const paths = build.getAt(0).getArray()
          const id = e.feature.getProperty('id')
          const currentPath = paths.map(elem => [elem.lng(), elem.lat()])
          this.serverPolygonsCommenced[id] = currentPath
          const p = new window.google.maps.Polygon({
            paths: build.getAt(0).getArray(),
            map,
            fillColor: '#000000',
            strokeColor: '#000000',
            strokeWeight: 0.5,
          })
          addListenersOnPolygonForEdit(p, id, typeOf)
          addListenersOnPolygonForDelete(p, id, typeOf)
        }
      })

      const drawingManager = new window.google.maps.drawing.DrawingManager({
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.BOTTOM_CENTER,
          drawingModes: ['polygon'],
        },
        polygonOptions: {
          fillColor: '#1B5E20',
          strokeColor: '#1B5E20',
          strokeWeight: 0.5,
          editable: true,
        },
      })
      drawingManager.setMap(map)
      window.google.maps.event.addListener(drawingManager, 'polygoncomplete', (e) => {
        const coordinates = e.getPath().getArray()
        const coordArr = []
        coordinates.forEach((elem) => {
          coordArr.push([
            elem.lng(),
            elem.lat(),
          ])
        })
        this.addPolygon = coordArr
        this.addingPolygonId = Date.now().toString()
      })
    },

    createPolygon() {
      if (this.addPolygonType === 'ServiceAvailable') {
        this.serverPolygonsAvailable[this.addingPolygonId] = [this.addPolygon]
        this.addPolygonType = ''
        this.addingPolygonId = 0
      } else if (this.addPolygonType === 'BuildCommenced') {
        this.serverPolygonsCommenced[this.addingPolygonId] = [this.addPolygon]
        this.addPolygonType = ''
        this.addingPolygonId = 0
      }
    },

    editPolygon() {
      if (this.editedPolygonBufferAvail) {
        this.editedPolygonBufferAvail.setOptions({
          fillColor: '#A00E0D',
          strokeColor: '#A00E0D',
          editable: false,
        })
        this.editedPolygonBufferAvail = null
      } else if (this.editedPolygonBufferCommenced) {
        this.editedPolygonBufferCommenced.setOptions({
          fillColor: '#000000',
          strokeColor: '#000000',
          editable: false,
        })
        this.editedPolygonBufferCommenced = null
      } else {
        // eslint-disable-next-line no-alert
        alert("Click on the edited polygon before hitting 'Edit polygon' button")
      }
    },

    deletePolygon() {
      if (this.deletedPolygonBufferAvail) {
        this.deletedPolygonBufferAvail.setOptions({
          visible: false,
        })
        this.deletedPolygonBufferAvail = null
        delete this.serverPolygonsAvailable[this.deletedPolygonAvail]
      } else if (this.deletedPolygonBufferCommenced) {
        this.deletedPolygonBufferCommenced.setOptions({
          visible: false,
        })
        this.deletedPolygonBufferCommenced = null
        delete this.serverPolygonsCommenced[this.deletedPolygonCommenced]
      } else {
        // eslint-disable-next-line no-alert
        alert("Click on the polygon you want to delete before hitting 'Delete polygon' button")
      }
    },
  },

  mounted() {
    this.initMap()
    // this.$store.dispatch('SAVE_POLYGONS', data)
  },
}
</script>
