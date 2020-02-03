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
        <p>If one of editing modes is selected (add, delete) then the rest of it won't be availble until the existing action is in progress!</p>
        <p class="mb-8">If there were no changes (current data and server data states are equal), "APPLY CHANGES" button also won't be available.</p>
        <ol>
          <li class="mb-8">
            <h3 class="mb-2">Adding marker</h3>
            <p>Click the "ACTIVATE ADD MODE" button.</p>
            <p>"Address" input field and "SEARCH" button will be actived. Also there will appear drawing tools panel (in the bottom left corner of the map).</p>
            <p>Select the marker tool then, on map's hover cursor appearance will change to cross. Press left mouse button to add a marker. "ADD MARKER" button will be active too.</p>
            <p>Click the "ADD MARKER" button to apply changes (to add marker).</p>
            <p>You also can add markers by typing an address to the "Address" input field - just begin typing, then select the right address from the dropdown list, or just click the "SEARCH" button. After that there will appear a marker on the map, right in the mentioned place.</p>
            <p><b class="mb-5">After drawing marker (or applying by typing an adress) click the "ADD MARKER" button, and only then start to draw (type an adress) another one!</b></p>
            <p>To exit adding mode click the "DEACTIVATE ADD MODE" button. Pay attention that "APPLY CHANGES" button is activated now.</p>
          </li>
          <li class="mb-8">
            <h3 class="mb-2">Deleting marker</h3>
            <p>Press the "ACTIVATE DELETE MODE" button.</p>
            <p>Click <b>right mouse button</b> on a marker that you want to delete - selected martker will be bouncing.</p>
            <p>When marker was selected click the "DELETE MARKER" button and selected marker will be deleted.</p>
            <p><b>Also pay your attention</b> that you can select only one marker at a time.</p>
            <p><b>When marker was selected it's nessesary to click the "DELETE MARKER" and only then select another one to delete!</b></p>
            <p>To exit deleting mode click the "DEACTIVATE DELETE MODE" button. Pay attention that "APPLY CHANGES" button is activated now.</p>
          </li>
          <li class="mb-8">
            <h3 class="mb-2">Applying changes</h3>
            <p>After you have made all the changes, "APPLY CHANGES" button will be activated.</p>
            <p><b>Pay your attention</b> if there is some editing modes actived (adding, deleting) the "APPLY CHANGES" button won't be active.</p>
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
