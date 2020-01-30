<template>
  <v-container>
    <v-card flat class="pt-4" id="map" min-height="70vh">
    </v-card>
    <v-row class="justify-space-around align-end">
      <v-card flat class="pa-4" max-width="220px">
        <v-radio-group v-model="addPolygonType">
          <v-radio label="Service available" value="ServiceAvailable" color="#A00E0D" />
          <v-radio label="Build commenced" value="BuildCommenced"/>
        </v-radio-group>
        <v-btn :disabled="!(addingPolygonId && addPolygonType)" color="success" @click="createPolygon" width="100%">Add polygon</v-btn>
      </v-card>
      <v-card flat class="pa-4" max-width="220px">
        <v-checkbox v-model="deleteActivated" label="Activate delete mode" value="active" />
        <v-btn :disabled="!(deleteActivated)" color="error" width="100%">Delete polygon</v-btn>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import mapConfigs from '@/configs/map'

export default {
  data() {
    return {
      place: { lat: -37.87013628, lng: 144.963058 },
      addPolygonType: '',
      deleteActivated: '',
      addingPolygonId: 0,
      serverPolygons: [],
      addPolygons: [],
      deletePolygons: [],
      currentPolygons: [],
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

      const addListenersOnPolygon = (polygon) => {
        window.google.maps.event.addListener(polygon, 'click', () => {
          if (this.deleteActivated) {
            const coordinates = polygon.getPath().getArray()
            const coordArr = []
            coordinates.forEach((elem) => {
              coordArr.push([
                elem.lng(),
                elem.lat(),
              ])
            })
            console.log(polygon)
            console.log(this.serverPolygons)
          }
        })
      }

      let avail = null
      const availPoly = []
      let build = null
      const buildPoly = []
      state.addListener('addfeature', (e) => {
        if (e.feature.getProperty('typeOf') === 'ServiceAvailable') {
          avail = e.feature.getGeometry()
          const paths = avail.getAt(0).getArray()
          console.log(paths)
          const currentPath = paths.map(elem => [elem.lng(), elem.lat()])
          this.serverPolygons.push(currentPath)
          const p = new window.google.maps.Polygon({
            paths,
            map,
            fillColor: '#A00E0D',
            strokeColor: '#A00E0D',
            strokeWeight: 0.5,
            editable: true,
            clickable: true,
          })
          addListenersOnPolygon(p)
          availPoly.push(p)
        } else {
          build = e.feature.getGeometry()
          const p = new window.google.maps.Polygon({
            paths: build.getAt(0).getArray(),
            map,
            fillColor: '#000000',
            strokeColor: '#000000',
            strokeWeight: 0.5,
            editable: true,
          })
          addListenersOnPolygon(p)
          buildPoly.push(p)
        }
      })

      availPoly.forEach((polygon) => {
        window.google.maps.event.addListener(polygon, 'click', () => {
          alert(this.indexID)
        })
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
        this.addPolygons = coordArr
        this.addingPolygonId = Date.now().toString()
      })
    },

    createPolygon() {
      const newPolygon = {
        type: 'Feature',
        properties: {
          id: this.addingPolygonId,
          typeOf: this.addPolygonType,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [this.addPolygons],
        },
      }
      console.log(JSON.stringify(newPolygon))
    },
  },

  mounted() {
    this.initMap()
  },
}
</script>
