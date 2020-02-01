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
        <v-btn width="100%" class="mb-4" @click="showInfo">{{infoShown ? "Close info" : "Show info"}}</v-btn>
        <v-btn width="100%" color="accent" :disabled="addActivated || !!editActivated || !!deleteActivated || checkApplyButton()" @click="applyChanges">Apply changes</v-btn>
        <!-- <v-btn width="100%" color="accent" @click="applyChanges">Apply changes</v-btn> -->
      </v-card>

      <!-- <v-card flat class="pa-4" max-width="220px">
        <v-btn  width="100%" @click="showData">Show state data</v-btn>
      </v-card> -->
    </v-row>
    <v-card-text class='pa-4' v-if="infoShown">
      <h1 class="mb-4">How it works</h1>
      <h3>Important notes</h3>
      <p>При выборе любого из режимов (добавление, редактирование, удаление) остальные режимы будут недоступны, пока не завершится текущее действие!</p>
      <p class="mb-8">Также кнопка "APPLY CHANGES" не будет активна, если не было произведено никаких изменений (состояние данных на сервере соответсвует текущему, отрисованному на карте).</p>
      <ol>
        <li class="mb-8">
          <h3 class="mb-2">Adding polygon</h3>
          <p>Нажмите кнопку "ACTIVATE ADD MODE".</p>
          <p>Появятся два радиобаттона "Service available" и "Build commenced", также появится окно с выбором инструмента для рисования (левый нижний угол карты).</p>
          <p>Отметьте нужный радиобаттон, выберите инструмент рисования полигонов (значок полигона справа от значка руки). При наведении на карту курсор должен поменять свой вид на перекрестие.</p>
          <p>Далее начните рисование (клик левой кнопкой мыши поставит вершину полигона).<b> Обратите внимание, что полигон должен быть замкнутым,</b> об этом будет свидетельствовать появление зеленого цвета заливки полигона.</p>
          <p>Когда полигон был успешно отрисован, нажмите кнопку "ADD POLYGON". Кнопка будет доступна только в случае если полигон замкнут и отмечен один из чекбоксов с типом полигона ("Service Available" or "Build Commenced").</p>
          <p><b class="mb-5">После отрисовки полигона обязательно нажмите кнопку "ADD POLYGON", и только потом переходите к рисованию следующего!</b></p>
          <p>После нажатия кнопки "ADD POLYGON" добавленный полигон поменяет цвет заливки на цвет соответсвующий его типу.</p>
          <p>Для выхода из режима редактирования нажмите кнопку "DEACTIVATE ADD MODE". После нажатия обратите внимание, что кнопка "APPLY CHANGES" стала доступна для нажатия</p>
        </li>
        <li class="mb-8">
          <h3 class="mb-2">Editing polygon</h3>
          <p>Поставьте галочку "Activate edit mode".</p>
          <p>Нажамите на полигоне который хотите отредактировать левой кнопкой мыши. Цвет заливки полигона станет оранжевым, станут активными вершины и средние точки сторон.</p>
          <p>Нажмите на активной доступной для редактирования точке и перетащите ее в нужном направлении, удерживая левую кнопку мыши нажатой.</p>
          <p>Если полигон был выбран для редактирования по ошибке, нажатие на нем правой кнопкой мыши позволит отменить редактирование.<b> Обратите внимание</b> - если были сделаны изменения в текущем полигоне, а после была нажата правая кнопка мыши - изменения не сохраняются для отправки на сервер, но остаются отрисованными на карте до следующего обновления данных на сервере.</p>
          <p>После того как полигон отредактирован, <b>кликните по нему левой кнопкой мыши</b> и нажмите кнопку "EDIT POLYGON", чтобы применить изменения.</p>
          <p><b>Также обратите внимание</b>, что можно редактировать только один полигон одновременно.</p>
          <p><b class="mb-5">Для применения изменений геометрии полигона обязательно нажмите кнопку "EDIT POLYGON", и только потом переходите к редактированию следующего!</b></p>
          <p>Обратите внимание, что кнопка "APPLY CHANGES" стала доступна для нажатия</p>
        </li>
        <li class="mb-8">
          <h3 class="mb-2">Deleting polygon</h3>
          <p>Поставьте галочку "Activate delete mode".</p>
          <p>Нажамите на полигоне который хотите удалить левой кнопкой мыши, цвет заливки полигона станет красным.</p>
          <p>Если полигон был выбран для удаления по ошибке, нажатие на нем правой кнопкой мыши позволит отменить выделение.</p>
          <p>После того как полигон выбран нажмите кнопку "DELETE POLYGON", и выбранный полигон перестанет отображаться на карте.</p>
          <p><b>Также обратите внимание</b>, что для удаления можно выбрать только один полигон одновременно.</p>
          <p><b>После выбора полигона обязательно нажмите кнопку "DELETE POLYGON", и только потом переходите к выбору следующего!</b></p>
          <p>Обратите внимание, что кнопка "APPLY CHANGES" стала доступна для нажатия</p>
        </li>
        <li class="mb-8">
          <h3 class="mb-2">Applying changes</h3>
          <p>После того, как были сделаны все необходимые изменения, кнопка "APPLY CHANGES" станет доступной для нажатия.</p>
          <p><b>Обратите внимание</b>, что кнопка "APPLY CHANGES" активна только в случае, когда не активны режимы редактирования и были внесены какие-то изменения в геометрию полигонов.</p>
          <p><b>При нажатии "APPLY CHANGES" внесенные изменения будут отправленны на сервер</b></p>
          <p>Процесс отправки данных занимает какое-то время, на время загрузки поле карты будет недоступно.</p>
          <p>После успешной отправки данных будет снова отображена карта с актуальной версией полигонов с сервера.</p>
        </li>
      </ol>
    </v-card-text>
  </v-container>
</template>

<script>
/* eslint-disable no-console */

import { mapGetters } from 'vuex'

import mapConfigs from '@/configs/map'

export default {
  data() {
    return {
      infoShown: false,

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
        this.deletedPolygonAvail = ''
      } else if (this.deletedPolygonBufferCommenced) {
        this.deletedPolygonBufferCommenced.setOptions({
          visible: false,
        })
        this.deletedPolygonBufferCommenced = null
        delete this.serverPolygonsCommenced[this.deletedPolygonCommenced]
        this.deletedPolygonCommenced = ''
      } else {
        // eslint-disable-next-line no-alert
        alert("Click on the polygon you want to delete before hitting 'Delete polygon' button, or click right mouse button to cancel deleting this polygon")
      }
    },

    async applyChanges() {
      // this.structureToSend.features
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
<<<<<<< HEAD
      /* eslint-disable-next-line */
      console.log(newPolygon)
=======
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
>>>>>>> b552e791941153c665bf9b9bd097a6dbc9ce1c9a
    },
  },

  mounted() {
    this.initMap()
  },
}
</script>
