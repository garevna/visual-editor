<template>
  <v-container>
    <v-card flat class="pt-4" id="map" min-height="70vh">
    </v-card>
    <v-row class="justify-space-around align-end">

      <v-card flat class="pa-4" max-width="220px">
        <v-btn width="100%" class="mb-4" color="info" :disabled="!!deleteActivated || !!editActivated" @click="createDrawingClass">
          {{addActivated ? "Deactivate add mode" : "Activate add mode"}}
        </v-btn>
        <v-radio-group v-if="addActivated" v-model="addPolygonType">
          <v-radio label="Service available" value="ServiceAvailable" color="#A00E0D" />
          <v-radio label="Build commenced" value="BuildCommenced"/>
        </v-radio-group>
        <v-btn width="100%" color="success" :disabled="!(addingPolygonId && addPolygonType)" @click="createPolygon">Add polygon</v-btn>
      </v-card>

      <v-card flat class="pa-4" max-width="220px">
        <v-checkbox label="Activate edit mode" value="active" v-model="editActivated" :disabled="!!deleteActivated || addActivated" />
        <v-btn width="100%" color="warning" :disabled="!(editActivated)" @click="editPolygon">Edit polygon</v-btn>
      </v-card>

      <v-card flat class="pa-4" max-width="220px">
        <v-checkbox label="Activate delete mode" value="active" v-model="deleteActivated" :disabled="!!editActivated || addActivated" />
        <v-btn width="100%" color="error" :disabled="!(deleteActivated)" @click="deletePolygon">Delete polygon</v-btn>
      </v-card>

      <v-card flat class="pa-4" max-width="220px">
        <v-btn width="100%" class="mb-4" @click="dialog=true">Instruction</v-btn>
        <v-btn width="100%" color="accent" :disabled="addActivated || !!editActivated || !!deleteActivated || checkApplyButton()" @click="applyChanges">Apply changes</v-btn>
        <!-- <v-btn width="100%" color="accent" @click="applyChanges">Apply changes</v-btn> -->
      </v-card>

      <!-- <v-card flat class="pa-4" max-width="220px">
        <v-btn  width="100%" @click="showData">Show state data</v-btn>
      </v-card> -->
    </v-row>

    <InstructionForPolygons :dialog.sync="dialog"/>
  </v-container>
</template>

<script>
/* eslint-disable no-console */

import { mapGetters } from 'vuex'

import mapConfigs from '@/configs/map'
import InstructionForPolygons from '@/components/InstructionForPolygons.vue'

export default {
  components: {
    InstructionForPolygons,
  },
  data() {
    return {
      dialog: false,

      place: { lat: -37.85701362, lng: 144.963058 },

      map: null,

      drawing: null,

      addActivated: false,
      editActivated: '',
      deleteActivated: '',

      addPolygonType: '',
      addingPolygonId: 0,
      addingPolygon: [],

      addedPolygonBuffer: null,

      editedPolygonAvail: {},
      editedPolygonCommenced: {},
      editedPolygonId: '',
      editedPolygonBufferAvail: null,
      editedPolygonBufferCommenced: null,

      deletedPolygonAvail: '',
      deletedPolygonCommenced: '',
      deletedPolygonBufferAvail: null,
      deletedPolygonBufferCommenced: null,

      serverPolygonsAvailable: {},
      serverPolygonsCommenced: {},

      initialServerPolygonsAvailable: {},
      initialServerPolygonsCommenced: {},
    }
  },

  computed: {
    ...mapGetters({
      endpoint: 'map/polygonsEndpoint',
    }),
  },

  methods: {
    // showData() {
    //   console.log('%c addPolygonType: ', this.addPolygonType)
    //   console.log('%c addingPolygonId: ', this.addingPolygonId)
    //   console.log('%c addingPolygon: ', this.addingPolygon)
    //   console.log('%c addedPolygonBuffer: ', 'color: green; font-weight: bold;', this.addedPolygonBuffer)
    //   console.log('%c editedPolygonAvail: ', 'color: #FF6F00;', this.editedPolygonAvail)
    //   console.log('%c editedPolygonCommenced: ', 'color: #FF6F00;', this.editedPolygonCommenced)
    //   console.log('%c editedPolygonId: ', 'color: #FF6;', this.editedPolygonId)
    //   console.log('%c editedPolygonBufferAvail: ', 'color: #FF6F00; font-weight: bold;', this.editedPolygonBufferAvail)
    //   console.log('%c editedPolygonBufferCommenced: ', 'color: #FF6F00; font-weight: bold;', this.editedPolygonBufferCommenced)
    //   console.log('%c deletedPolygonAvail: ', 'color: #D32F2F;', this.deletedPolygonAvail)
    //   console.log('%c deletedPolygonCommenced: ', 'color: #D32F2F;', this.deletedPolygonCommenced)
    //   console.log('%c deletedPolygonBufferAvail: ', 'color: #D32F2F; font-weight: bold;', this.deletedPolygonBufferAvail)
    //   console.log('%c deletedPolygonBufferCommenced: ', 'color: #D32F2F; font-weight: bold;', this.deletedPolygonBufferCommenced)
    //   console.log('%c serverPolygonsAvailable: ', 'color: #09b; font-weight: bold;', this.serverPolygonsAvailable)
    //   console.log('%c serverPolygonsCommenced: ', 'color: #09b; font-weight: bold;', this.serverPolygonsCommenced)
    //   console.log('%c initialServerPolygonsAvailable: ', 'color: #09b; font-weight: bold;', this.initialServerPolygonsAvailable)
    //   console.log('%c initialServerPolygonsCommenced: ', 'color: #09b; font-weight: bold;', this.initialServerPolygonsCommenced)
    //   console.log('%c compared states: ', 'color: red; font-weight: bold;', JSON.stringify(this.serverPolygonsAvailable) === JSON.stringify(this.initialServerPolygonsAvailable))
    //   console.log(this.checkApplyButton())
    //   console.log('---------------------------------------------')
    // },

    showInfo() {
      this.infoShown = !this.infoShown
    },

    checkApplyButton() {
      return (JSON.stringify(this.serverPolygonsAvailable) === JSON.stringify(this.initialServerPolygonsAvailable) && JSON.stringify(this.serverPolygonsCommenced) === JSON.stringify(this.initialServerPolygonsCommenced))
    },

    addListenersOnPolygonForEdit(polygon, id, typeOf) {
      window.google.maps.event.addListener(polygon, 'click', () => {
        if (this.editActivated && !this.editedPolygonId ? true : this.editedPolygonId === id) {
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
          this.editedPolygonId = id
          if (typeOf === 'ServiceAvailable' && JSON.stringify(coordArr) !== JSON.stringify(this.serverPolygonsAvailable[id])) {
            this.editedPolygonAvail[id] = coordArr
            this.editedPolygonBufferAvail = polygon
          } else if (typeOf === 'BuildCommenced' && JSON.stringify(coordArr) !== JSON.stringify(this.serverPolygonsCommenced[id])) {
            this.editedPolygonCommenced[id] = coordArr
            this.editedPolygonBufferCommenced = polygon
          }
        }
      })
    },

    addListenersOnPolygonRightClick(polygon, typeOf) {
      window.google.maps.event.addListener(polygon, 'rightclick', () => {
        this.editedPolygonId = ''
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
    },

    addListenersOnPolygonForDelete(polygon, id, typeOf) {
      window.google.maps.event.addListener(polygon, 'click', () => {
        if (this.deleteActivated && !this.deletedPolygonAvail && !this.deletedPolygonCommenced) {
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


      state.addListener('addfeature', (e) => {
        if (e.feature.getProperty('typeOf') === 'ServiceAvailable') {
          const avail = e.feature.getGeometry()
          const typeOf = e.feature.getProperty('typeOf')
          const paths = avail.getAt(0).getArray()
          const id = e.feature.getProperty('id')
          const currentPath = paths.map(elem => [elem.lng(), elem.lat()])
          this.serverPolygonsAvailable[id] = currentPath
          this.initialServerPolygonsAvailable[id] = [...currentPath]
          const p = new window.google.maps.Polygon({
            paths,
            map,
            fillColor: '#A00E0D',
            strokeColor: '#A00E0D',
            strokeWeight: 0.5,
            clickable: true,
          })
          this.addListenersOnPolygonForEdit(p, id, typeOf)
          this.addListenersOnPolygonForDelete(p, id, typeOf)
          this.addListenersOnPolygonRightClick(p, typeOf)
        } else {
          const build = e.feature.getGeometry()
          const typeOf = e.feature.getProperty('typeOf')
          const paths = build.getAt(0).getArray()
          const id = e.feature.getProperty('id')
          const currentPath = paths.map(elem => [elem.lng(), elem.lat()])
          this.serverPolygonsCommenced[id] = currentPath
          this.initialServerPolygonsCommenced[id] = [...currentPath]
          const p = new window.google.maps.Polygon({
            paths: build.getAt(0).getArray(),
            map,
            fillColor: '#000000',
            strokeColor: '#000000',
            strokeWeight: 0.5,
          })
          this.addListenersOnPolygonForEdit(p, id, typeOf)
          this.addListenersOnPolygonForDelete(p, id, typeOf)
          this.addListenersOnPolygonRightClick(p, typeOf)
        }
      })
    },

    createDrawingClass() {
      this.addActivated = !this.addActivated
      if (this.addActivated) {
        const drawingManager = new window.google.maps.drawing.DrawingManager({
          drawingControlOptions: {
            position: window.google.maps.ControlPosition.BOTTOM_LEFT,
            drawingModes: ['polygon'],
          },
          polygonOptions: {
            fillColor: '#1B5E20',
            strokeColor: '#1B5E20',
            strokeWeight: 0.5,
          },
        })
        this.drawing = drawingManager
        this.drawing.setMap(this.map)
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
          this.addedPolygonBuffer = e
        })
      } else {
        this.drawing.setMap(null)
      }
    },

    createPolygon() {
      this.addListenersOnPolygonForEdit(this.addedPolygonBuffer, this.addingPolygonId, this.addPolygonType)
      this.addListenersOnPolygonForDelete(this.addedPolygonBuffer, this.addingPolygonId, this.addPolygonType)
      this.addListenersOnPolygonRightClick(this.addedPolygonBuffer, this.addPolygonType)
      if (this.addPolygonType === 'ServiceAvailable') {
        this.addedPolygonBuffer.setOptions({
          fillColor: '#A00E0D',
          strokeColor: '#A00E0D',
          editable: false,
        })
        this.serverPolygonsAvailable[this.addingPolygonId] = this.addPolygon
        this.addPolygonType = ''
        this.addingPolygonId = 0
      } else if (this.addPolygonType === 'BuildCommenced') {
        this.addedPolygonBuffer.setOptions({
          fillColor: '#000000',
          strokeColor: '#000000',
          editable: false,
        })
        this.serverPolygonsCommenced[this.addingPolygonId] = this.addPolygon
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
        this.editedPolygonId = ''
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
        this.editedPolygonId = ''
        const editedId = Object.keys(this.serverPolygonsCommenced).find(id => this.editedPolygonCommenced[id])
        if (editedId) {
          this.serverPolygonsCommenced[editedId] = this.editedPolygonCommenced[editedId]
        }
      }
    },

    deletePolygon() {
      if (this.deletedPolygonBufferAvail) {
        this.deletedPolygonBufferAvail.setOptions({
          visible: false,
        })
        this.deletedPolygonBufferAvail = null
        delete this.serverPolygonsAvailable[this.deletedPolygonAvail]
        this.deletedPolygonAvail = ''
      } else if (this.deletedPolygonBufferCommenced) {
        this.deletedPolygonBufferCommenced.setOptions({
          visible: false,
        })
        this.deletedPolygonBufferCommenced = null
        delete this.serverPolygonsCommenced[this.deletedPolygonCommenced]
        this.deletedPolygonCommenced = ''
      }
    },

    async applyChanges() {
      const availArr = Object.keys(this.serverPolygonsAvailable).map(id => ({
        type: 'Feature',
        properties: {
          id,
          typeOf: 'ServiceAvailable',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[...this.serverPolygonsAvailable[id], this.serverPolygonsAvailable[id][0]]],
        },
      }))
      const commencedArr = Object.keys(this.serverPolygonsCommenced).map(id => ({
        type: 'Feature',
        properties: {
          id,
          typeOf: 'BuildCommenced',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[...this.serverPolygonsCommenced[id], this.serverPolygonsCommenced[id][0]]],
        },
      }))

      const structureToSend = {
        type: 'FeatureCollection',
        features: [...availArr, ...commencedArr],
      }
      document.querySelector('#map').innerHTML = '<p style="text-align: center; margin-top: 50px;">Loading...</p>'

      this.drawing = null
      this.addActivated = false
      this.editActivated = ''
      this.deleteActivated = ''
      this.addPolygonType = ''
      this.addingPolygonId = 0
      this.addingPolygon = []
      this.addedPolygonBuffer = null
      this.editedPolygonAvail = {}
      this.editedPolygonCommenced = {}
      this.editedPolygonId = ''
      this.editedPolygonBufferAvail = null
      this.editedPolygonBufferCommenced = null
      this.deletedPolygonAvail = ''
      this.deletedPolygonCommenced = ''
      this.deletedPolygonBufferAvail = null
      this.deletedPolygonBufferCommenced = null
      this.serverPolygonsAvailable = {}
      this.serverPolygonsCommenced = {}
      this.initialServerPolygonsAvailable = {}
      this.initialServerPolygonsCommenced = {}

      await this.$store.dispatch('map/SAVE_POLYGONS', structureToSend)
      this.initMap()
    },
  },

  mounted() {
    this.initMap()
  },
}
</script>
