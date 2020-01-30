<template>
  <v-container>
    <v-card flat class="pt-4" id="map" min-height="70vh">
    </v-card>
    <v-row class="justify-space-around align-end">

      <v-card flat class="pa-4" max-width="220px">
        <v-btn :disabled="!!deleteActivated || !!editActivated" @click="createDrawingClass" width="100%" class="mb-4" color="info" >
          Activate add mode
        </v-btn>
        <v-radio-group v-if="addActivated" v-model="addPolygonType">
          <v-radio label="Service available" value="ServiceAvailable" color="#A00E0D" />
          <v-radio label="Build commenced" value="BuildCommenced"/>
        </v-radio-group>
        <v-btn :disabled="!(addingPolygonId && addPolygonType)" color="success" @click="createPolygon" width="100%">Add polygon</v-btn>
      </v-card>

      <v-card flat class="pa-4" max-width="220px">
        <v-checkbox v-model="editActivated" label="Activate edit mode" value="active" :disabled="!!deleteActivated || addActivated" />
        <v-btn :disabled="!(editActivated)" color="warning" width="100%" @click="editPolygon">Edit polygon</v-btn>
      </v-card>

      <v-card flat class="pa-4" max-width="220px">
        <v-checkbox v-model="deleteActivated" label="Activate delete mode" value="active" :disabled="!!editActivated || addActivated" />
        <v-btn :disabled="!(deleteActivated)" color="error" width="100%" @click="deletePolygon">Delete polygon</v-btn>
      </v-card>

      <v-card flat class="pa-4" max-width="220px">
        <v-btn width="100%" @click="showServerData">Show server data</v-btn>
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

      map: null,

      drawing: null,

      addActivated: false,
      editActivated: '',
      deleteActivated: '',

      addPolygonType: '',

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
    showServerData() {
      console.log('ServiceAvailable', this.serverPolygonsAvailable)
      console.log('BuildCommenced', this.serverPolygonsCommenced)
      console.log(this.editedPolygonBufferAvail)
    },

    initMap() {
      const map = new window.google.maps.Map(document.querySelector('#map'), {
        center: this.place,
        zoom: 13,
        styles: mapConfigs,
      })

      this.map = map

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
            } else if (typeOf === 'BuildCommenced' && JSON.stringify(coordArr) !== JSON.stringify(this.serverPolygonsCommenced[id])) {
              this.editedPolygonCommenced[id] = coordArr
              this.editedPolygonBufferCommenced = polygon
            }
          }
        })
      }

      const addListenersOnPolygonRightClick = (polygon, typeOf) => {
        window.google.maps.event.addListener(polygon, 'rightclick', () => {
          this.deletedPolygonAvail = ''
          this.deletedPolygonCommenced = ''
          this.deletedPolygonBufferAvail = null
          this.deletedPolygonBufferCommenced = null
          if (typeOf === 'ServiceAvailable') {
            polygon.setOptions({
              fillColor: '#A00E0D',
              strokeColor: '#A00E0D',
              fillOpacity: 0.3,
              editable: false,
            })
          } else if (typeOf === 'BuildCommenced') {
            polygon.setOptions({
              fillColor: '#000000',
              strokeColor: '#000000',
              fillOpacity: 0.3,
              editable: false,
            })
          }
        })
      }

      const addListenersOnPolygonForDelete = (polygon, id, typeOf) => {
        window.google.maps.event.addListener(polygon, 'click', () => {
          if (this.deleteActivated) {
            polygon.setOptions({
              fillColor: '#D32F2F',
              strokeColor: '#D32F2F',
              fillOpacity: 0.7,
            })
            if (typeOf === 'ServiceAvailable' && id === Object.keys(this.serverPolygonsAvailable).find(key => key === id)) {
              this.deletedPolygonAvail = id
              this.deletedPolygonBufferAvail = polygon
            } else if (typeOf === 'BuildCommenced' && id === Object.keys(this.serverPolygonsCommenced).find(key => key === id)) {
              this.deletedPolygonCommenced = id
              this.deletedPolygonBufferCommenced = polygon
            }
          }
        })
      }

      state.addListener('addfeature', (e) => {
        if (e.feature.getProperty('typeOf') === 'ServiceAvailable') {
          const avail = e.feature.getGeometry()
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
          addListenersOnPolygonRightClick(p, typeOf)
        } else {
          const build = e.feature.getGeometry()
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
          addListenersOnPolygonRightClick(p, typeOf)
        }
      })
    },

    createDrawingClass() {
      this.addActivated = true
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
      this.drawing = drawingManager
      this.drawing.setMap(this.map)
      window.google.maps.event.addListener(drawingManager, 'polygoncomplete', (e) => {
        console.log(e)
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

      // if (this.addPolygonType === 'ServiceAvailable') {
      //   this.serverPolygonsAvailable[this.addingPolygonId] = [this.addPolygon]
      //   this.addPolygonType = ''
      //   this.addingPolygonId = 0
      // } else if (this.addPolygonType === 'BuildCommenced') {
      //   this.serverPolygonsCommenced[this.addingPolygonId] = [this.addPolygon]
      //   this.addPolygonType = ''
      //   this.addingPolygonId = 0
      // }
    },

    editPolygon() {
      if (this.editedPolygonBufferAvail) {
        this.editedPolygonBufferAvail.setOptions({
          fillColor: '#A00E0D',
          strokeColor: '#A00E0D',
          editable: false,
        })
        this.editedPolygonBufferAvail = null
        const editedId = Object.keys(this.serverPolygonsAvailable).find(id => this.editedPolygonAvail[id])
        if (editedId) {
          this.serverPolygonsAvailable[editedId] = this.editedPolygonAvail[editedId]
        }
      } else if (this.editedPolygonBufferCommenced) {
        this.editedPolygonBufferCommenced.setOptions({
          fillColor: '#000000',
          strokeColor: '#000000',
          editable: false,
        })
        this.editedPolygonBufferCommenced = null
        const editedId = Object.keys(this.serverPolygonsCommenced).find(id => this.editedPolygonCommenced[id])
        if (editedId) {
          this.serverPolygonsCommenced[editedId] = this.editedPolygonCommenced[editedId]
        }
      } else {
        // eslint-disable-next-line no-alert
        alert("Click on the edited polygon before hitting 'Edit polygon' button, or click right mouse button to cancel editing this polygon")
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
        alert("Click on the polygon you want to delete before hitting 'Delete polygon' button, or click right mouse button to cancel deleting this polygon")
      }
    },
  },

  mounted() {
    this.initMap()
    // this.$store.dispatch('SAVE_POLYGONS', data)
  },
}
</script>
