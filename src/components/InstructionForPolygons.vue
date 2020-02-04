<template>
  <v-dialog v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
  >
    <v-toolbar dark color="secondary">
      <v-toolbar-title>How it works</v-toolbar-title>
      <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="$emit('update:dialog', false)">Close</v-btn>
        </v-toolbar-items>
    </v-toolbar>
    <v-card class="pa-4">
      <v-card-title><h3>Important notes</h3></v-card-title>
        <v-card-text class='pa-4'>
        <p>If one of editing modes is selected (add, edit, delete) then the rest of it won't be availble until the existing action is in progress!</p>
        <p class="mb-8">If there were no changes (current data and server data states are equal), "APPLY CHANGES" button also won't be available.</p>
        <ol>
          <li class="mb-8">
            <h3 class="mb-2">Adding polygon</h3>
            <p>Click the "ACTIVATE ADD MODE" button.</p>
            <p>"Service available" and "Build commenced" radio buttons will appear, also there will appear drawing tools panel (in the bottom left corner of the map).</p>
            <p>Select the option you need, select the polygon tool then. On map's hover cursor appearance will change to cross.</p>
            <p>Then begin to draw (you can make polygon's vertex simply by clicking left mouse button).<b>Note that polygon has to be enclosed</b>, then polygon's background color will change to green.</p>
            <p>Click the "ADD POLYGON" button when finished drawing a polygon. Button will be available only when it is enclosed and one of checkboxes is marked ("Service Available" or "Build Commenced").</p>
            <p><b class="mb-5">After drawing polygon click the "ADD POLYGON" button, and only then start to draw another one!</b></p>
            <p>Pressing the "ADD POLYGON" button will change it's background color depending on selected polygon's type.</p>
            <p>To exit adding mode click the "DEACTIVATE ADD MODE" button. Pay attention that "APPLY CHANGES" button is activated now.</p>
          </li>
          <li class="mb-8">
            <h3 class="mb-2">Editing polygon</h3>
            <p>Check the "Activate edit mode" box.</p>
            <p>Click left mouse button to select polygon that needs to be edited. Polygon's background color will change to orange, it's vertexes will be editable now.</p>
            <p>Click on the active editable point and drag it in the desired direction while holding the left mouse button.</p>
            <p>If the polygon was chosen for editing by mistake, right-clicking on it will cancel the editing.<b> Pay attention</b> - if changes were made in the current polygon, and after the right mouse button was clicked (to cancel the editing), the changes are not saved for sending to the server, but remain drawn on the map until the next data update.</p>
            <p>After the polygon has been edited, <b> left-click on it </b> and press the "EDIT POLYGON" button to apply the changes.</p>
            <p><b> Also note </b> that you can only edit one polygon at a time.</p>
            <p><b class="mb-5">To apply changes to the polygon geometry, be sure to click the "EDIT POLYGON" button, and only then proceed to edit the next one!</b></p>
            <p>Pay attention that "APPLY CHANGES" button is activated now.</p>
          </li>
          <li class="mb-8">
            <h3 class="mb-2">Deleting polygon</h3>
            <p>Check the "Activate delete mode" box.</p>
            <p>Click on the polygon that you want to delete with the left mouse button, the color of the polygon fill will turn red.</p>
            <p>If the polygon was selected for deletion by mistake, right-clicking on it will cancel the selection.</p>
            <p>After the polygon is selected, press the "DELETE POLYGON" button, and the selected polygon will no longer be displayed on the map.</p>
            <p><b>Also note </b> that only one polygon can be selected for deletion at a time.</p>
            <p><b>After selecting the polygon, be sure to press the "DELETE POLYGON" button, and only then proceed to the selection of the next one!</b></p>
            <p>Pay attention that "APPLY CHANGES" button is activated now.</p>
          </li>
          <li class="mb-8">
            <h3 class="mb-2">Applying changes</h3>
            <p>After you have made all the changes, "APPLY CHANGES" button will be activated.</p>
            <p><b>Please note </b> that the "APPLY CHANGES" button is active only when the editing modes are not active and some changes have been made to the geometry of the polygons.</p>
            <p><b>By clicking the "APPLY CHANGES" button you confirm and send new data to the server.</b></p>
            <p>Sending data process can take some time, the map won't be available until sending finishes.</p>
            <p>When data was successfully sent there will be displayed the map with all the changes than you just sent.</p>
          </li>
        </ol>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'InstructionForPolygons',
  props: {
    dialog: Boolean,
  },
  data: () => ({
    //
  }),
}
</script>
