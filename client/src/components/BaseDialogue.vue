<template>
    <base-popup ref="popup">
        <h2 style="margin-top: 0">{{ title }}</h2>
        <p>{{ message }}</p>
        <div class="btns">
            <button class="cancel-btn" @click="_cancel">{{ cancelButton }}</button>
            <button class="ok-btn" @click="_confirm">{{ okButton }}</button>
        </div>
    </base-popup>
</template>

<script>
    import BasePopup from './BasePopup.vue'
    
    export default {
        name: 'BaseDialogue',
    
        components: { BasePopup },
    
        data: () => ({
            // Parameters that change depending on the type of dialogue
            title: undefined,
            message: undefined, // Main text content
            okButton: undefined, // Text for confirm button; leave it empty because we don't know what we're using it for
            cancelButton: 'Abbrechen', // text for cancel button
            
            // Private variables
            resolvePromise: undefined,
            rejectPromise: undefined,
        }),
    
        methods: {
            show(opts = {}) {
                this.title = opts.title
                this.message = opts.message
                this.okButton = opts.okButton
                if (opts.cancelButton) {
                    this.cancelButton = opts.cancelButton
                }
                // Once we set our config, we tell the popup modal to open
                this.$refs.popup.open()
                // Return promise so the caller can get results
                return new Promise((resolve, reject) => {
                    this.resolvePromise = resolve
                    this.rejectPromise = reject
                })
            },
    
            _confirm() {
                this.$refs.popup.close()
                this.resolvePromise(true)
            },
    
            _cancel() {
                this.$refs.popup.close()
                this.resolvePromise(false)
                // Or you can throw an error
                // this.rejectPromise(new Error('User cancelled the dialogue'))
            },
        },
    }
    </script>

<style scoped>
    .btns {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    
    .ok-btn {
        padding: 0.5em 1em;
        background-color: rgb(255, 219, 198);
        color: rgb(255,95,0);
        border: 2px solid rgb(255,95,0);
        border-radius: 5px;
        font-weight: bold;
        font-size: 16px;
        text-transform: uppercase;
        cursor: pointer;
        margin-left: 4px;
    }
    
    .cancel-btn {
        padding: 0.5em 1em;
        background-color: white;
        color: grey;
        border: 2px solid grey;
        border-radius: 5px;
        font-weight: bold;
        font-size: 16px;
        text-transform: uppercase;
        cursor: pointer;
        margin-right: 4px;
    }
    </style>