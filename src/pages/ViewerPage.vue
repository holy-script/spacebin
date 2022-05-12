<template>
  <q-page>
    <q-header elevated>
      <q-bar>
        <q-icon name="text_snippet" />
        <div class="non-selectable">SpaceBin</div>

        <q-space />

        <div class="non-selectable">Rich Text Viewer</div>

        <q-space />

        <q-btn
          dense
          flat
          icon="home"
          label="Home"
          @click="goToHome"
        />
      </q-bar>

      <div class="q-pa-sm q-pl-md row items-center">
        <div class="non-selectable">
          Read-Only
        </div>
      </div>
    </q-header>

    <div class="flex row flex-center">
      <div class="q-pa-md col-12">
        <q-editor
          min-height="70vh"
          v-model="editorContent"
          placeholder="Patience is a virtue 😁"
          toolbar-push
          readonly
        />
      </div>

      <div class="q-pa-md flex flex-center">
        <img
          v-for="(url, index) of imgData"
          :key="index"
          :src="url"
          class="image q-mb-md"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { Appwrite } from "appwrite";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  name: "ViewerPage",

  setup() {
    const editorContent = ref("");
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();
    const sdk = new Appwrite();
    const imgData = ref([]);

    sdk
      .setEndpoint("http://167.71.73.45/v1")
      .setProject("627d1ed6517ab616df31");

    sdk.account.get().catch((e) => {
      sdk.account.createAnonymousSession();
    });

    onMounted(() => {
      sdk.database
        .getDocument("627d590a0aae0be4f287", route.params.uid)
        .then((res) => {
          editorContent.value = res.textContent;
          imgData.value = res.mediaData;
        })
        .catch((e) => {
          $q.notify({
            message: "Note not found, returning to home screen 😅",
            position: "center",
            timeout: 3000,
            progress: true,
            onDismiss: () => {
              setTimeout(() => {
                router.push({
                  name: "Home",
                });
              }, 500);
            },
          });
        });
    });

    const goToHome = () => {
      $q.dialog({
        title: "Confirm Navigation Action",
        message: "Would you like to return to the home screen?",
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          router.push({
            name: "Home",
          });
        })
        .onCancel(() => {
          $q.notify({
            message: "Feel free to keep working! 😊",
            position: "bottom",
            timeout: 3000,
            progress: true,
          });
        });
    };

    return {
      editorContent,
      goToHome,
      imgData,
    };
  },
});
</script>

<style lang="sass">
.image
	max-width: 90vw
</style>
