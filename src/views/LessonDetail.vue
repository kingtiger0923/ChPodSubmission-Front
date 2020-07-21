<template>
  <div class="page-content">
    <div class="background"></div>
    <app-sidebar></app-sidebar>
    <div class="content-container">
      <app-navbar></app-navbar>
      <div class="content">
        <div class="empty-region"></div>
        <div class="lesson-detail">
            <div class="title">
                Lesson "{{this.$route.params.num}}" Assets:
                <div id="dnd" :class="{'hover': isHovered}" ref="fileform">
                    <div v-show="isFailed">
                        <p>Failed to Upload Assets</p>
                        <small>Please try again!</small>
                        <button @click="tryAgain">Try Again</button>
                    </div>
                    <form enctype="multipart/form-data" method="post" v-show="!isFailed">
                        <div class="progressBar" v-show="isUploading >= 0">
                            <div class="file-progress" v-for="(per, index) in uploadPercentage" :key="index">
                                <div>{{files[index].name}}</div>
                                <div class="progress">
                                    <div class="progress-bar progress-bar-striped active" role="progressbar"
                                        :aria-valuenow="getProgressValue(per)" aria-valuemin="0"
                                        aria-valuemax="100" :style="{width:getProgressValue(per) + '%'}">
                                        {{getProgressValue(per)}}%
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="dnd-container" v-show="files.length == 0 && isUploading == -1">
                            <img src="../assets/images/upload.png">
                            <p>Drag and Drop Your Files</p>
                            <p style="font-size: 11px;">Only mp3/wav/jpg</p>
                        </div>
                        <div class="uploadedFiles" v-show="files.length > 0 && isUploading == -1">
                            <div v-for="(file, key) in files" class="file-listing" :key="key" @click="removeFile( key )">
                                {{ file.name }}
                            </div>
                        </div>
                        <button class="dndAlternative" v-show="files.length > 0 && isUploading == -1" @click.prevent="uploadFiles();">Upload</button>
                        <input type="file" name="upload">
                    </form>
                </div>
            </div>
            <div class="status">
                <div class="desc">Submission Received for {{this.$route.params.num}}:</div>
                <div class="audioFiles">
                    <p> - Audio Files</p>
                </div>
                <div class="audioFiles">
                    <p> - Image Files</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import {POST} from '../utils/api';
import SideBar from '../components/sidebar';
import NavBar from '../components/navbar';
export default {
    data() {
        return {
            currentLesson: {},
            dragAndDropCapable: false,
            files: [],
            uploadPercentage: [],
            isUploading: -1,
            isHovered: false,
            isFailed: false
        }
    },
    methods: {
        tryAgain() {
            this.files = [];
            this.isUploading = -1;
            this.uploadPercentage = [];
            this.isFailed = false;
        },
        getProgressValue(val) {
            return val.percent;
        },
        SignOut() {
            localStorage.removeItem("user_Id");
            this.$router.push({
                name: "Login"
            });
        },
        determineDragAndDropCapable(){
            var div = document.createElement('div');
            return ( ( 'draggable' in div )
                || ( 'ondragstart' in div && 'ondrop' in div ) )
                && 'FormData' in window
                && 'FileReader' in window;
        },
        removeFile( key ){
            this.files.splice( key, 1 );
        },
        uploadFiles() {
            this.isUploading = this.files.length;
            this.uploadPercentage = [];
            for( let i = 0; i < this.files.length; i++ ){
                let self = this;
                let idx = i;
                self.uploadPercentage.push({
                    percent: 0,
                    finish: false
                });
                let formData = new FormData();

                let file = self.files[idx];
                formData.append('files', file);

                const api = self.$store.state.backend_URL + "/uploadassets"
                Vue.axios.post(api, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    params: { 
                        LN: self.$route.params.num
                    },
                    onUploadProgress: function( progressEvent ) {
                        let percent = parseInt( Math.round( (progressEvent.loaded * 100) / progressEvent.total ) );
                        let finished = this.uploadPercentage[idx].finish;
                        
                        Vue.set(this.uploadPercentage, idx, 
                                { percent, finish: percent == 100 });
                        
                        if( this.uploadPercentage[idx].finish == true && finished == false ) {
                            this.isUploading --;
                            if( this.isUploading == 0 ) {
                                console.log("start");
                                setTimeout(function() {
                                    self.isUploading = -1;
                                    self.files = [];
                                    self.uploadPercentage = [];
                                }, 2000);
                            }
                        }
                    }.bind(self)
                }).then(function() {
                    console.log("One File Success");
                }).catch(function() {
                    self.isFailed = true;
                });
            }
        }
    },
    mounted() {
        this.dragAndDropCapable = this.determineDragAndDropCapable();
        if( this.dragAndDropCapable ) {
            ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach( function( evt ) {
                this.$refs.fileform.addEventListener(evt, function(e){
                    e.preventDefault();
                    e.stopPropagation();
                }.bind(this), false);
            }.bind(this));
            var self = this;
            this.$refs.fileform.addEventListener('drop', function(e){
                for( let i = 0; i < e.dataTransfer.files.length; i++ ){
                    var splits = e.dataTransfer.files[i].name.split(".");
                    var group = splits[0];
                    var exten = splits[splits.length - 1];
                    if( this.$route.params.num != group ) continue;
                    if( splits.length != 4 && splits.length != 5 )
                        continue;
                    if( exten != "jpg" && exten != "mp3" && exten != "wav" )
                        continue;
                    this.files.push( e.dataTransfer.files[i] );
                }
                self.isHovered = false;
            }.bind(this));
            this.$refs.fileform.addEventListener('dragover', function() {
                self.isHovered = true;
            });
            
            this.$refs.fileform.addEventListener('dragleave', function() {
                self.isHovered = false;
            })
        }
        let api = this.$store.state.backend_URL + "/getLessonAssets";

        POST(api, {
          number: this.$route.params.num
        }).then((response) => {
            if( response.data == "error" ) {
                self.Signout();
            } else {
                this.currentLesson = response.data;
            }
        }).catch(() => {
            alert("Server Not Found!");
            self.SignOut();
        });
    },
    components: {
        appSidebar : SideBar,
        appNavbar: NavBar
    }
}
</script>

<style scoped>

.lesson-detail .status {
    color: black;
    font-weight: bold;
    font-size: 1.4em;
    text-align: left;
    padding: 20px 20px;
}

.lesson-detail .status .audioFiles {
    font-size: 0.7em;
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
  border-radius: 4px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
  border-radius: 4px;
}

#dnd p{
    margin-top: 1rem;
    margin-bottom: 1rem;
}

div.file-listing{
    margin: auto;
    padding: 10px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
    font-size: 20px;
    overflow-x: hidden;
  }

div.file-listing img{
    height: 100px;
    width: 100px;
}

#dnd .file-listing:hover {
    color: lightgreen;
}

#dnd .uploadedFiles {
    max-height: 500px;
    overflow-y: scroll;
    overflow-x: hidden;
}

#dnd .progressBar {
    max-height: 500px;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 0px 10px;
}

#dnd .progressBar .file-progress {
    padding: 5px 10px;
    font-size: 15px;
}

div.remove-container{
    text-align: center;
}

div.remove-container a{
    color: red;
    cursor: pointer;
}

#dnd {
    width: 100%;
    text-align: left;
    padding: 20px;
    margin: auto;
    background-color: transparent;
    border: 1px dashed black;
}

#dnd.hover {
    border: 3px dashed black;
}

#dnd input[type="file"] {
    display: none;
}

#dnd .dnd-container {
    height: 320px;
    text-align: center;
    padding-top: 40px;
    color: #4e4e4e;
}

#dnd button {
    cursor: pointer;
    width: 100%;
    height: 40px; 
    line-height: 40px;
    text-align: center;
    background: none; 
    border : none; 
    outline : none; 
    color: white;
    padding: 0; 
    margin: 0;
    background: #4bc5c3;
    margin-right: 10px;
}

.lesson-detail .title {
    padding: 35px 20px 0px;
    color: black;
    font-weight: bold;
    font-size: 25px;
    text-align: left;
}

.lesson-detail {
    width: 80%;
    margin: auto;
    margin-top: 80px;
    margin-bottom: 80px;
    color: white;
    box-shadow: 6px 10px 8px #9995;
    padding: 0px 15px;
}

.content {
  display: flex;
  width: 100%;
}

.content .empty-region {
  width: 300px;
  height: 100vh;
}

.page-content {
  width: 100%;
  min-height: 100vh;
}

.page-content .background {
  /* background-image: url('../assets/images/bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover; */
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>