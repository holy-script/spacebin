<template>
  <q-page class="">
    <q-header elevated>
      <q-bar>
        <q-icon name="text_snippet" />
        <div class="non-selectable">SpaceBin</div>

        <q-space />

        <div class="non-selectable">Rich Text Editor</div>

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
        <div class="cursor-pointer non-selectable">
          File
          <q-menu>
            <q-list
              dense
              style="min-width: 100px"
            >
              <q-separator />

              <q-item
                clickable
                v-close-popup
                @click="clearAll"
              >
                <q-item-section>New...</q-item-section>
              </q-item>

              <q-separator />

              <q-item
                clickable
                v-close-popup
                @click="pubDialog"
              >
                <q-item-section>Publish</q-item-section>
              </q-item>

              <q-separator />
            </q-list>
          </q-menu>
        </div>
      </div>
    </q-header>

    <div class="flex row flex-center">
      <div class="q-pa-md col-12">
        <q-editor
          min-height="70vh"
          v-model="editorContent"
          placeholder="What you see is what you get 😉"
          toolbar-push
        />
      </div>

      <q-file
        class="col-8 q-mb-md"
        clearable
        multiple
        accept="image/*"
        bottom-slots
        v-model="images"
        label="Images"
        max-file-size="1048576"
        max-total-size="5242880"
        :max-files="5"
        counter
        @update:model-value="fileImages"
        @rejected="fileErrors"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
        <template v-slot:append>
          <q-icon name="folder" />
        </template>

        <template v-slot:hint>
          5 Images @ 1MB Each
        </template>
      </q-file>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import { Appwrite } from "appwrite";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "EditorPage",

  setup() {
    const editorContent = ref("");
    const images = ref([]);
    const $q = useQuasar();
    const router = useRouter();
    const sdk = new Appwrite();
    const imgData = ref([]);

    sdk
      .setEndpoint("http://167.71.73.45/v1")
      .setProject("627d1ed6517ab616df31");

    sdk.account.get().catch((e) => {
      sdk.account.createAnonymousSession();
    });

    const fileImages = (arr) => {
      imgData.value = [];
      if (arr) {
        for (let i of arr) {
          let file = new FileReader();
          file.onload = (evt) => {
            imgData.value.push(evt.target.result);
          };
          file.readAsDataURL(i);
        }
      }
    };

    const fileErrors = (errors) => {
      for (let err of errors) {
        switch (err.failedPropValidation) {
          case "max-file-size":
            $q.notify({
              group: false,
              message: "Individual File Size Exceeded 🙁",
              position: "bottom",
              timeout: 3000,
              progress: true,
            });
            break;
          case "max-total-size":
            $q.notify({
              group: false,
              message: "Total File Size Exceeded 🙁",
              position: "bottom",
              timeout: 3000,
              progress: true,
            });
            break;
          case "max-files":
            $q.notify({
              group: false,
              message: "Total File Number Exceeded 🙁",
              position: "bottom",
              timeout: 3000,
              progress: true,
            });
            break;
          case "accept":
            $q.notify({
              group: false,
              message: "File Format Inacceptable 🙁",
              position: "bottom",
              timeout: 3000,
              progress: true,
            });
            break;
        }
      }
    };

    const clearAll = () => {
      $q.dialog({
        title: "Confirm Discard Action",
        message: "Would you like to revert to a blank note?",
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          editorContent.value = "";
          images.value = [];
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

    const pubDialog = () => {
      if (editorContent.value) {
        $q.dialog({
          title: "Confirm Publish Action",
          message: "Would you like to finish editing and generate a link?",
          cancel: true,
          persistent: true,
        })
          .onOk(() => {
            sdk.database
              .createDocument(
                "627d590a0aae0be4f287",
                "unique()",
                {
                  textContent: editorContent.value,
                  mediaData: imgData.value,
                },
                ["role:all"]
              )
              .then((res) => {
                $q.dialog({
                  title: "Link Generated",
                  message: `Your unique link is: <a target="_blank" href='${window.location.origin}/#/viewer/${res.$id}'>Here</a><br/>It should be something like http://spacebin.tech/#/viewer/2u8nns13ub<br/>Keep it safe!`,
                  persistent: true,
                  html: true,
                  ok: "Take Me Home",
                }).onOk(() => {
                  router.push({
                    name: "Home",
                  });
                });
                $q.notify({
                  message: "Note Successfully Uploaded! 😎",
                  position: "bottom",
                  timeout: 3000,
                  progress: true,
                });
              })
              .catch((err) => {
                $q.notify({
                  message: err.message,
                  position: "bottom",
                  timeout: 3000,
                  progress: true,
                });
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
      } else {
        $q.notify({
          message: "Cannot Publish Empty Notes 🙄",
          position: "bottom",
          timeout: 3000,
          progress: true,
        });
      }
    };

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
      images,
      pubDialog,
      fileImages,
      clearAll,
      goToHome,
      fileErrors,
    };
  },
});
</script>

<style lang="sass">
</style>
