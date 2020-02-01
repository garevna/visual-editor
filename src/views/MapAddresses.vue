<template>
  <v-container>
    <v-card flat class="pt-4" id="map" min-height="70vh">
    </v-card>
    <v-row class="justify-space-around align-end">

       <v-card flat class="pa-4" max-width="220px">
        <v-checkbox label="Activate add mode" value="active" v-model="addActivated" :disabled="!!deleteActivated || !!editActivated" />
        <v-btn width="100%" color="success" :disabled="!addActivated" @click="addMarker">Add marker</v-btn>
      </v-card>

       <v-card flat class="pa-4" max-width="220px">
        <v-checkbox label="Activate edit mode" value="active" v-model="editActivated" :disabled="!!deleteActivated || !!addActivated" />
        <v-btn width="100%" color="warning" :disabled="!editActivated" @click="editMarker">Edit marker</v-btn>
      </v-card>

       <v-card flat class="pa-4" max-width="220px">
        <v-checkbox label="Activate delete mode" value="active" v-model="deleteActivated" :disabled="!!editActivated || !!addActivated" />
        <v-btn width="100%" color="error" :disabled="!deleteActivated" @click="deleteMarker">Delete marker</v-btn>
      </v-card>

      <v-card flat class="pa-4" max-width="220px">
        <v-btn  width="100%" @click="showData">Show state data</v-btn>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable no-unused-vars */

import { mapGetters } from 'vuex'

import mapConfigs from '@/configs/map'

export default {
  data() {
    return {
      place: { lat: -37.85013628, lng: 144.953058 },

      addActivated: '',
      editActivated: '',
      deleteActivated: '',

      stateMarkers: {},
      initialServerMarkers: {},
    }
  },

  computed: {
    ...mapGetters({
      endpoint: 'map/pointsEndpoint',
    }),
  },

  methods: {

    showData() {
      console.log('%c stateMarkers: ', 'color: #FF6F00; font-weight: bold;', this.stateMarkers)
    },

    addListenersOnMarkerForEdit(marker, id) {
      window.google.maps.event.addListener(marker, 'click', () => {
        if (this.editActivated) {
          marker.setOptions({
            draggable: true,
            label: 'Edited',
          })
        }
      })
    },

    initMap() {
      const map = new window.google.maps.Map(document.querySelector('#map'), {
        center: this.place,
        zoom: 12,
        styles: mapConfigs,
      })

      const state = new window.google.maps.Data()
      state.loadGeoJson(this.endpoint)

      state.addListener('addfeature', (e) => {
        const id = e.feature.getProperty('id')
        const address = e.feature.getProperty('address')
        const geo = e.feature.getGeometry()
        let coordinates
        const paths = geo.forEachLatLng((elem) => { coordinates = [+elem.lat().toFixed(5), +elem.lng().toFixed(5)] })
        // console.log(e.feature)
        const marker = new window.google.maps.Marker({
          position: { lat: coordinates[0], lng: coordinates[1] },
          map,
          // draggable: true,
        })
        this.addListenersOnMarkerForEdit(marker, id)
      })
    },

    addMarker() {
      console.log('added')
    },

    editMarker() {
      console.log('edited')
    },

    deleteMarker() {
      console.log('deleted')
    },
  },
  mounted() {
    this.initMap()
  },
}
</script>
