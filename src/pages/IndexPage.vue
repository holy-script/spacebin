<template>
  <q-page
    padding
    class="flex flex-center"
  >
    <div class="text-center">
      <q-card bordered>
        <q-card-section>
          <div class="text-h5">The Minimal Rich Text & Image Storage Application</div>
          <div class="text-subtitle2">by Palash Johri</div>
        </q-card-section>

        <q-card-section>
          Brought to life with Appwrite(Back End) and Quasar(Front End), it uses anonymous user sessions, and generates unique, shareable links to published bins. Media support initialized with images stored in the back end database.
        </q-card-section>
      </q-card>
      <q-btn
        class="q-ma-lg"
        no-caps
        push
        color="primary"
        label="Create My Bin!"
        @click="goToEditor()"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "IndexPage",

  setup() {
    const router = useRouter();
    const goToEditor = () => {
      router.push({
        name: "Editor",
      });
    };

    return {
      goToEditor,
    };
  },
});
</script>
