<template>
  <v-container>
    <v-card flat class="pt-4" id="map" min-height="60vh"/>
    <v-row class="justify-space-between align-end">

      <v-card flat class="flex-grow-1 pa-4">
        <v-btn width="100%" class="mb-4" color="info" :disabled="deleteActivated" @click="activateAddMode">
          {{addActivated ? "Deactivate add mode" : "Activate add mode"}}
        </v-btn>
        <v-text-field label="Address" single-line outlined ref="address" :disabled="!addActivated"/>
        <v-btn width="100%" color="primary" class="mb-4" ref="search" :disabled="!addActivated">Search</v-btn>
        <v-btn width="100%" color="success" :disabled="!addingMarkerBuffer" @click="addMarker">Add marker</v-btn>
      </v-card>

       <v-card flat class="pa-4 align-self-stretch d-flex flex-column justify-space-between" width="260px">
        <v-btn width="100%" class="mb-4" color="info" :disabled="addActivated" @click="deleteActivateHandler">
          {{deleteActivated ? "Deactivate delete mode" : "Activate delete mode"}}
        </v-btn>
        <v-btn width="100%" color="error" :disabled="!deleteActivated" @click="deleteMarker">Delete marker</v-btn>
      </v-card>

      <v-card flat class="pa-4 align-self-stretch d-flex flex-column justify-space-between" max-width="220px">
        <v-btn width="100%" class="mb-4" @click="dialog=true">Instruction</v-btn>
        <v-btn width="100%" color="accent" :disabled="deleteActivated || addActivated || checkApplyButton()" @click="applyChanges">Apply changes</v-btn>
        <!-- <v-btn width="100%" color="accent" @click="applyChanges">Apply changes</v-btn> -->
      </v-card>

      <!-- <v-card flat class="pa-4" max-width="220px">
        <v-btn  width="100%" @click="showData">Show state data</v-btn>
      </v-card>-->

    </v-row>

    <InstructionForMarkers :dialog.sync="dialog"/>

  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import mapConfigs from '@/configs/map'

import InstructionForMarkers from '@/components/InstructionForMarkers.vue'

export default {
  components: {
    InstructionForMarkers,
  },
  data() {
    return {
      dialog: false,

      place: { lat: -37.85013628, lng: 144.953058 },

      map: null,

      addActivated: false,
      deleteActivated: false,

      addingMarker: {},
      addingMarkerBuffer: null,
      addingMarkerId: '',

      selectedMarker: null,
      selectedMarkerId: '',

      stateMarkers: {},
      initialServerMarkers: {},

      searchInput: null,
    }
  },

  computed: {
    ...mapGetters({
      endpoint: 'map/pointsEndpoint',
    }),
  },

  methods: {

    // showData() {
    //   console.log('%c addingMarker: ', 'color: #1B5E20; font-weight: bold;', this.addingMarker)
    //   console.log('%c stateMarkers: ', 'color: #FF6F00; font-weight: bold;', this.stateMarkers)
    //   console.log('%c initialServerMarkers: ', 'color: #FF6F00; font-weight: bold;', this.initialServerMarkers)
    //   console.log('%c states are equal: ', 'color: #FF6;', JSON.stringify(this.initialServerMarkers) === JSON.stringify(this.stateMarkers))
    // },

    checkApplyButton() {
      return (JSON.stringify(this.stateMarkers) === JSON.stringify(this.initialServerMarkers))
    },

    deleteActivateHandler() {
      this.deleteActivated = !this.deleteActivated
    },

    addListenersOnMarkerForRightclick(marker, id) {
      window.google.maps.event.addListener(marker, 'rightclick', () => {
        if (this.deleteActivated && !this.selectedMarkerId) {
          marker.setAnimation(window.google.maps.Animation.BOUNCE)
          this.selectedMarker = marker
          this.selectedMarkerId = id
        }
      })
    },

    initMap() {
      const map = new window.google.maps.Map(document.querySelector('#map'), {
        center: this.place,
        zoom: 12,
        styles: mapConfigs,
      })

      this.map = map

      const state = new window.google.maps.Data()
      state.loadGeoJson(this.endpoint)

      state.addListener('addfeature', (e) => {
        const id = e.feature.getProperty('id')
        const address = e.feature.getProperty('address')
        const geo = e.feature.getGeometry()
        let coordinates
        geo.forEachLatLng((elem) => { coordinates = [+elem.lat().toFixed(5), +elem.lng().toFixed(5)] })
        this.stateMarkers[id] = { address, coordinates }
        this.initialServerMarkers[id] = { address, coordinates: [...coordinates] }
        const marker = new window.google.maps.Marker({
          position: { lat: coordinates[0], lng: coordinates[1] },
          map,
        })
        this.addListenersOnMarkerForRightclick(marker, id)
      })
    },

    activateAddMode() {
      this.addActivated = !this.addActivated
      if (this.addActivated) {
        const { map } = this
        const searchInput = this.$refs.address.$el.querySelector('input')
        this.searchInput = searchInput

        const searchBox = new window.google.maps.places.SearchBox(
          searchInput,
        )

        window.google.maps.event.addListener(searchBox, 'places_changed', () => {
          const marker = new window.google.maps.Marker({
            position: null,
            map,
          })
          const places = searchBox.getPlaces()
          const bounds = new window.google.maps.LatLngBounds()
          const place = places[0]
          const geo = place.geometry.location
          bounds.extend(geo)
          marker.setPosition(geo)
          this.addingMarkerBuffer = marker
          map.fitBounds(bounds)
          map.setZoom(15)
          let address = []
          place.address_components.forEach(obj => address.push(obj.long_name))
          address = address.join(',')
          this.addingMarkerId = `pin${Date.now().toString()}`
          const coordinates = [+geo.toJSON().lat.toFixed(5), +geo.toJSON().lng.toFixed(5)]
          this.addingMarker[this.addingMarkerId] = { address, coordinates }
        })

        const geocoder = new window.google.maps.Geocoder()
        const searchButton = this.$refs.search.$el

        searchButton.onclick = () => {
          if (searchInput.value) {
            const marker = new window.google.maps.Marker({
              position: null,
              map,
            })
            const bounds = new window.google.maps.LatLngBounds()
            const address = searchInput.value
            geocoder.geocode({ address }, (results, status) => {
              const place = results[0]
              const geo = place.geometry.location
              // eslint-disable-next-line eqeqeq
              if (status == 'OK') {
                bounds.extend(geo)
                marker.setPosition(geo)
                this.addingMarkerBuffer = marker
                map.fitBounds(bounds)
                map.setZoom(15)
                let addressLocal = []
                place.address_components.forEach(obj => addressLocal.push(obj.long_name))
                addressLocal = addressLocal.join(',')
                this.addingMarkerId = `pin${Date.now().toString()}`
                const coordinates = [+geo.toJSON().lat.toFixed(5), +geo.toJSON().lng.toFixed(5)]
                this.addingMarker[this.addingMarkerId] = { address: addressLocal, coordinates }
              }
            })
          }
        }

        const drawingManager = new window.google.maps.drawing.DrawingManager({
          drawingControlOptions: {
            position: window.google.maps.ControlPosition.BOTTOM_LEFT,
            drawingModes: ['marker'],
          },
        })
        this.drawing = drawingManager
        this.drawing.setMap(this.map)
        window.google.maps.event.addListener(drawingManager, 'markercomplete', (e) => {
          const LatLng = e.getPosition()
          geocoder.geocode({ location: LatLng }, (results, status) => {
            const place = results[0]
            const geo = place.geometry.location
            // eslint-disable-next-line eqeqeq
            if (status == 'OK') {
              this.addingMarkerBuffer = e
              let addressLocal = []
              place.address_components.forEach(obj => addressLocal.push(obj.long_name))
              addressLocal = addressLocal.join(',')
              this.addingMarkerId = `pin${Date.now().toString()}`
              const coordinates = [+geo.toJSON().lat.toFixed(5), +geo.toJSON().lng.toFixed(5)]
              this.addingMarker[this.addingMarkerId] = { address: addressLocal, coordinates }
            }
          })
        })
      } else {
        this.drawing.setMap(null)
      }
    },

    addMarker() {
      if (this.addingMarker[this.addingMarkerId]) {
        this.addListenersOnMarkerForRightclick(this.addingMarkerBuffer, this.addingMarkerId)
        this.stateMarkers[this.addingMarkerId] = this.addingMarker[this.addingMarkerId]
        this.addingMarkerBuffer = null
        this.searchInput.value = ''
        this.addingMarker = {}
        this.addingMarkerId = ''
      }
    },

    deleteMarker() {
      this.selectedMarker.setVisible(false)
      delete this.stateMarkers[this.selectedMarkerId]
      this.selectedMarker = null
      this.selectedMarkerId = ''
    },

    async applyChanges() {
      const result = {
        type: 'FeatureCollection',
        features: [],
      }

      const featuresArr = Object.keys(this.stateMarkers).map(id => ({
        type: 'Feature',
        properties: {
          id,
          address: this.stateMarkers[id].address,
        },
        geometry: {
          type: 'Point',
          coordinates: [this.stateMarkers[id].coordinates[1], this.stateMarkers[id].coordinates[0]],
        },
      }))
      result.features = featuresArr
      document.querySelector('#map').innerHTML = '<p style="text-align: center; margin-top: 50px;">Loading...</p>'

      this.addActivated = false
      this.deleteActivated = false
      this.addingMarker = {}
      this.addingMarkerId = ''
      this.selectedMarker = null
      this.selectedMarkerId = ''
      this.stateMarkers = {}
      this.initialServerMarkers = {}

      await this.$store.commit('map/MAP_POINTS', result)
      await this.$store.dispatch('map/WRITE_POINTS')

      this.initMap()
    },
  },
  mounted() {
    this.initMap()
  },
}
</script>
