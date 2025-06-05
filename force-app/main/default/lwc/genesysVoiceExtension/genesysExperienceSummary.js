import { LightningElement, track } from 'lwc';

export default class GenesysVoiceExtension extends LightningElement {
    @track callStatus = 'idle'; // idle, ringing, connected, ended
    @track isMuted = false;
    @track debugMode = true; // Set to false in production
    @track initialized = false;
    
    // Constructor
    constructor() {
        super();
        // Bind event listener to preserve 'this' context
        this.telephonyEventListener = this.handleTelephonyEvent.bind(this);
    }
    
    // Lifecycle hooks
    connectedCallback() {
        console.log('GenesysVoiceExtension: Component connected');
        // We'll subscribe in renderedCallback to ensure the DOM is ready
    }
    
    renderedCallback() {
        if (!this.initialized) {
            console.log('GenesysVoiceExtension: Component rendered, initializing...');
            this.initialized = true;
            this.subscribeToVoiceToolkit();
            this.checkForActiveCall();
        }
    }
    
    disconnectedCallback() {
        console.log('GenesysVoiceExtension: Component disconnected');
        this.unsubscribeFromVoiceToolkit();
    }
    
    // Check if there's already an active call when component loads
    checkForActiveCall() {
        console.log('GenesysVoiceExtension: Checking for active call...');
        // Using setTimeout to ensure toolkit API is fully initialized
        setTimeout(() => {
            try {
                const toolkitApi = this.getToolkitApi();
                if (toolkitApi) {
                    console.log('GenesysVoiceExtension: Toolkit API available, checking call state');
                    
                    // If we can access any call properties, assume a call is active
                    this.callStatus = 'connected';
                    console.log('GenesysVoiceExtension: Setting call status to connected in Voice Extension context');
                }
            } catch (error) {
                console.error('GenesysVoiceExtension: Error checking active call:', error);
            }
        }, 500);
    }
    
    // Subscribe to voice events
    subscribeToVoiceToolkit() {
        const toolkitApi = this.getToolkitApi();
        
        if (toolkitApi) {
            console.log('GenesysVoiceExtension: Subscribing to voice events');
            
            // Call state events
            toolkitApi.addEventListener('callstarted', this.telephonyEventListener);
            toolkitApi.addEventListener('callconnected', this.telephonyEventListener);
            toolkitApi.addEventListener('callended', this.telephonyEventListener);
            
            // Mute events
            toolkitApi.addEventListener('mute', this.telephonyEventListener);
            toolkitApi.addEventListener('unmute', this.telephonyEventListener);
            
            // Additional events to track call state
            toolkitApi.addEventListener('hold', this.telephonyEventListener);
            toolkitApi.addEventListener('resume', this.telephonyEventListener);
            
            console.log('GenesysVoiceExtension: Successfully subscribed to events');
        } else {
            console.error('GenesysVoiceExtension: Could not get toolkit API');
        }
    }
    
    // Unsubscribe from voice events
    unsubscribeFromVoiceToolkit() {
        const toolkitApi = this.getToolkitApi();
        
        if (toolkitApi) {
            console.log('GenesysVoiceExtension: Unsubscribing from voice events');
            
            // Call state events
            toolkitApi.removeEventListener('callstarted', this.telephonyEventListener);
            toolkitApi.removeEventListener('callconnected', this.telephonyEventListener);
            toolkitApi.removeEventListener('callended', this.telephonyEventListener);
            
            // Mute events
            toolkitApi.removeEventListener('mute', this.telephonyEventListener);
            toolkitApi.removeEventListener('unmute', this.telephonyEventListener);
            
            // Additional events
            toolkitApi.removeEventListener('hold', this.telephonyEventListener);
            toolkitApi.removeEventListener('resume', this.telephonyEventListener);
        }
    }
    
    // Handle voice events
    handleTelephonyEvent(event) {
        const eventType = event.type;
        console.log('GenesysVoiceExtension: Voice event received:', eventType, JSON.stringify(event.detail || {}));
        
        switch (eventType) {
            case 'callstarted':
                this.callStatus = 'ringing';
                this.isMuted = false;
                console.log('GenesysVoiceExtension: Call started, status =', this.callStatus);
                break;
                
            case 'callconnected':
                this.callStatus = 'connected';
                console.log('GenesysVoiceExtension: Call connected, status =', this.callStatus);
                break;
                
            case 'callended':
                this.callStatus = 'ended';
                this.isMuted = false;
                console.log('GenesysVoiceExtension: Call ended, status =', this.callStatus);
                break;
                
            case 'hold':
                this.callStatus = 'connected';
                console.log('GenesysVoiceExtension: Call on hold, but still active');
                break;
                
            case 'resume':
                this.callStatus = 'connected';
                console.log('GenesysVoiceExtension: Call resumed');
                break;
                
            case 'mute':
                this.isMuted = true;
                console.log('GenesysVoiceExtension: Call muted');
                break;
                
            case 'unmute':
                this.isMuted = false;
                console.log('GenesysVoiceExtension: Call unmuted');
                break;
        }
    }
    
    // Mute toggle handler
    handleToggleMute() {
        console.log('GenesysVoiceExtension: Mute button clicked, current state =', this.isMuted);
        const toolkitApi = this.getToolkitApi();
        
        if (toolkitApi) {
            try {
                if (this.isMuted) {
                    console.log('GenesysVoiceExtension: Attempting to unmute');
                    toolkitApi.unmute();
                } else {
                    console.log('GenesysVoiceExtension: Attempting to mute');
                    toolkitApi.mute();
                }
            } catch (error) {
                console.error('GenesysVoiceExtension: Error toggling mute:', error);
            }
        } else {
            console.error('GenesysVoiceExtension: Toolkit API not available');
        }
    }
    
    // Get toolkit API
    getToolkitApi() {
        return this.template.querySelector('lightning-service-cloud-voice-toolkit-api');
    }
    
    // Computed properties
    get isCallActive() {
        return this.callStatus === 'connected' || this.callStatus === 'ringing';
    }
    
    get isMuteDisabled() {
        return !this.isCallActive;
    }
    
    get muteIconName() {
        return this.isMuted ? 'utility:volume_off' : 'utility:volume_high';
    }
    
    get muteButtonLabel() {
        return this.isMuted ? 'Unmute' : 'Mute';
    }
    
    get muteButtonVariant() {
        return this.isMuted ? 'destructive' : 'brand';
    }
    
    get muteStateText() {
        return this.isMuted ? 'Muted' : 'Unmuted';
    }
    
    get buttonDisabledText() {
        return this.isMuteDisabled ? 'Yes' : 'No';
    }
}
