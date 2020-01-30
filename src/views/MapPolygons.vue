<template>
  <v-container>
    <v-card flat class="pt-4" id="map" min-height="70vh">
    </v-card>
    <v-card flat class="pa-4 mx-auto" max-width="320px" >
      <v-radio-group v-model="type">
        <v-radio label="Service available" value="ServiceAvailable" color="#A00E0D"></v-radio>
        <v-radio label="Build commenced" value="BuildCommenced"></v-radio>
      </v-radio-group>
      <v-btn :disabled="!type ? true : false" color="success" @click="createPolygon">Submit</v-btn>
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
      currentPolygonId: 0,
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
            editable: true,
          }))
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
        this.polygons = coordArr
        // console.log(coordArr)
      })
    },

    createPolygon() {
      this.currentPolygonId = Date.now().toString()
      const newPolygon = {
        type: 'Feature',
        properties: {
          id: this.currentPolygonId,
          typeOf: this.type,
        },
        geometry: {
          type: 'Polygon',
          coordinates: this.polygons,
        },
      }
      console.log(newPolygon)
    },
  },

  mounted() {
    this.initMap()
  },
}
</script>
