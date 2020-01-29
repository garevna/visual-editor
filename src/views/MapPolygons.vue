<template>
  <v-container>
    <v-card flat class="pt-4" id="map" min-height="70vh">
    </v-card>
    <v-card flat class="pa-4 mx-auto" max-width="320px" >
      <v-radio-group v-model="type" :mandatory="false">
        <v-radio label="Service available" value="ServiceAvailable" color="#A00E0D"></v-radio>
        <v-radio label="Build commenced" value="BuildCommenced"></v-radio>
      </v-radio-group>
      <v-btn :disabled="!type ? true : false" color="success">Submit</v-btn>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import mapConfigs from '@/configs/map'

export default {
  data() {
    return {
      place: { lat: -37.87013628, lng: 144.963058 },
      type: '',
      polygons: [
      ],
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
        zoom: 12,
        styles: mapConfigs,
        // disableDefaultUI: true,
      })

      const state = new window.google.maps.Data()
      state.loadGeoJson(this.endpoint)

      let avail = null
      const availPoly = []
      let build = null
      const buildPoly = []
      state.addListener('addfeature', (e) => {
        if (e.feature.getProperty('typeOf') === 'ServiceAvailable') {
          avail = e.feature.getGeometry()
          availPoly.push(new window.google.maps.Polygon({
            paths: avail.getAt(0).getArray(),
            map,
            fillColor: '#A00E0D',
            strokeColor: '#A00E0D',
            strokeWeight: 0.5,
            // clickable: false,
            // draggable: true,
            geodesic: true,
            editable: true,
          }))
        } else {
          build = e.feature.getGeometry()
          buildPoly.push(new window.google.maps.Polygon({
            paths: build.getAt(0).getArray(),
            map,
            fillColor: '#000000',
            strokeColor: '#000000',
            strokeWeight: 0.5,
            // clickable: false,
            // draggable: true,
            geodesic: true,
            editable: true,
          }))
        }
      })

      // const geocoder = new window.google.maps.Geocoder()
      // const searchButton = document.querySelector('#startSearch')

      // searchButton.onclick = () => {
      //   const bounds = new window.google.maps.LatLngBounds()
      //   const address = searchInput.value
      //   geocoder.geocode({ address }, (results, status) => {
      //     // eslint-disable-next-line eqeqeq
      //     if (status == 'OK') {
      //       checkAvail(results[0])
      //       bounds.extend(results[0].geometry.location)
      //       marker.setPosition(results[0].geometry.location)
      //     } else {
      //       this.$parent.toggleFail()
      //     }
      //     map.fitBounds(bounds)
      //     map.setZoom(15)
      //   })
      // }
    },
  },

  mounted() {
    this.initMap()
  },
}
</script>
