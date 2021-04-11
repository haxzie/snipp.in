<template>
  <div class="settings-contents">
    <section>
      <h4 class="section-title">
        Storage
      </h4>
      <div class="option-item">
        <label>Storage Driver</label>
        <p>Dexie IndexedDB (offline)</p>
      </div>
      <div class="option-item">
        <label>Storage Space</label>
        <pre>{{ storageSpace }}</pre>
        <div class="progress-bar">
          <div class="thumb" :style="{ width: `${usagePercentage}%` }"></div>
        </div>
      </div>
    </section>
    <section>
      <h4 class="section-title">
        Backup and Restore
      </h4>
      <div class="option-item">
        <label>Latest Backup</label>
        <div class="row">
          <p>Latest Backup</p>
          <button @click="createBackup">
            Download<DownloadIcon size="18" class="icon" />
          </button>
        </div>
      </div>
      <div class="option-item">
        <label>Restore a Backup</label>
        <div class="row">
          <p>Upload a backup file</p>
          <button @click="showUploadWindow">
            Upload<UploadIcon size="18" class="icon" />
          </button>
          <input
            v-show="false"
            ref="fileUpload"
            type="file"
            accept="text/JSON"
            @change="restoreBackupFromFile"
          />
        </div>
        <p v-if="restoringBackup" class="help-text info">Restoring...</p>
        <p v-if="restoreSuccessfull" class="help-text success">Successfully restored your backup</p>
        <p v-if="invalidBackup" class="help-text error">Invalid or tempered backup file</p>
      </div>
    </section>
  </div>
</template>

<script>
import { DownloadIcon, UploadIcon } from "vue-feather-icons";
import { mapActions } from "vuex";
import { saveAs } from "file-saver";

export default {
  components: {
    DownloadIcon,
    UploadIcon,
  },
  data() {
    return {
      storageSpace: "Loading...",
      usagePercentage: 0,
      restoringBackup: false,
      restoreSuccessfull: false,
      invalidBackup: false
    };
  },
  methods: {
    ...mapActions(["generateBackupData", "restoreBackup"]),
    async calculateStorageSpace() {
      try {
        const estimate = await window.navigator.storage.estimate();
        const { quota, usage } = estimate;
        this.storageSpace = `${(usage / (1024 * 1024)).toFixed(2)} MB / ${(
          quota /
          (1024 * 1024)
        ).toFixed(2)} MB`;
        this.usagePercentage = ((usage / quota) * 100).toFixed(2);
      } catch (error) {
        this.storageSpace = "Unable to calculate";
      }
    },
    async createBackup() {
      try {
        const backupData = await this.generateBackupData();
        const date = new Date();
        const fileName = `snippin-backup-${date.getTime()}.json`;
        const fileBlob = new Blob([JSON.stringify(backupData, null, 2)], {
          type: "text/JSON;charset=utf-8",
        });
        saveAs(fileBlob, fileName);
      } catch (error) {
        console.error(error);
      }
    },
    showUploadWindow() {
      this.$refs.fileUpload.click();
    },
    async restoreBackupFromFile(e) {
      this.restoringBackup = true;
      this.invalidBackup = false;
      this.restoreSuccessfull = false;
      const files = e.target.files;
      if (files && files.length > 0 && files[0]) {
        const fileToRestore = files[0];
        const fileReader = new FileReader();
        fileReader.onload = async () => {
          const fileContents = fileReader.result;
          try {
            const JsonifiedContents = JSON.parse(fileContents);
            await this.restoreBackup({ backup: JsonifiedContents  });
            this.restoreSuccessfull = true;
          } catch (error) {
            console.error(error);
            this.restoreSuccessfull = false;
            this.invalidBackup = true;
          }
        };
        fileReader.readAsText(fileToRestore)
      }
      this.restoringBackup = false;
    },
  },
  async mounted() {
    this.calculateStorageSpace();
  },
};
</script>

<style lang="scss" scoped>
.settings-contents {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 15px;
  column-gap: 20px;

  section {
    display: flex;
    flex-direction: column;

    .section-title {
      font-weight: bold;
      margin-bottom: 10px;
      // text-transform: uppercase;
    }
    label {
      font-size: 0.8rem;
      opacity: 0.7;
    }

    button {
      background: var(--color-input-background);
      border: 0;
      outline: none;
      display: flex;
      align-items: center;
      padding: 5px 10px;
      border-radius: 3px;
      color: var(--font-color);

      .icon {
        margin-left: 5px;
      }

      &:hover {
        cursor: pointer;
        color: var(--color-primary);
      }
    }

    .help-text {
      &.success {
        color: var(--color-primary);
      }
      &.info {
        color: var(--color-accent);
      }
      &.error {
        color: var(--color-error);
      }
    }

    .option-item {
      margin-bottom: 10px;

      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    .progress-bar {
      height: 5px;
      width: 100%;
      background: var(--color-input-background);
      margin: 5px 0;
      border-radius: 5px;

      .thumb {
        background: var(--color-primary);
        height: 100%;
        border-radius: 5px;
      }
    }
  }
}
</style>
