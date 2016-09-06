define(['HubLink', 'RIB', 'PropertiesPanel', 'Easy'], function(Hub, RIB, Ppanel, easy) {
  var actions = [];
  var inputs = ["a", "b", "c", "slide", "toggle_a", "toggle_b", "toggle_c", "basea", "baseb", "basec"];
  var _objects = {};
  var Touch = {
    settings:{
      Custom: {}
    },
    dataFeed: {}
  };

  Touch.getActions = function() {
    return actions;
  };

  Touch.getInputs = function() {
    return inputs;
  };

  /**
   * Triggered when added for the first time to the side bar.
   * This script should subscribe to all the events and broadcast
   * to all its copies the data.
   * NOTE: The call is bind to the block's instance, hence 'this'
   * does not refer to this module, for that use 'Touch'
   */
  Touch.onLoad = function(){
    var touch = this;
    // Load our properties template and keep it in memory
    this.loadTemplate('properties.html').then(function(template){
      touch.propTemplate = template;
    });

    // Subscribe to events
    Hub.subscribe("block:change", this).then(function(event){
      Hub.on(event, function(data){
        // Send my data to anyone listening
        touch.dispatchDataFeed(data);
        // Send data to logic maker for processing
        touch.processData(data);
      }, touch);
    }).catch(function(err){
      console.error("Subscription error: ", err);
    });
  };

  /**
   * Parent is asking me to execute my logic.
   * This block only initiate processing with
   * actions from the hardware.
   */
  Touch.onExecute = function() {};

  // Settings save
  function save() {
    var settings = easy.getValues();
    console.log(settings);
    this.settings = settings;
    this.saveSettings().then(function(){
      Ppanel.stopLoading();
    }).catch(function(err){
      console.error("Error saving settings: ", err);
    });
  }

  /**
   * Triggered when the user clicks on a block.
   * The interace builder is automatically opened.
   * Here we must load the elements.
   * NOTE: This is called with the scope set to the
   * Block object, to emailsess this modules properties
   * use Touch or this.controller
   */
  Touch.onClick = function(){
    var that = this;

    // Create a few listeners for the close/save actions
    Ppanel.onSave(save.bind(this));

    // Intercepts the closing action.
    // return 'false' to cancel the event
    // Ppanel.onClose(function(){});

    // Read the block's settings
    this.loadSettings(function(settings){
      console.log("Settings loaded: ", settings);
      // This block uses a custom (extra) event mode,
      // so we need to modify the default settings
      var eventMode = settings.EventMode;
      settings.EventMode = {
        property: 'EventMode',
        items: [
          { name: "Always", value: 0, selected: (eventMode == 0)?true:false },
          { name: "ChangeBy", value: 1, selected: (eventMode == 1)?true:false },
          { name: "EqualTo", value: 2, selected: (eventMode == 2)?true:false },
          { name: "GreaterThan", value: 3, selected: (eventMode == 3)?true:false },
          { name: "Toggle", value: 4, selected: (eventMode == 4)?true:false }
        ]
      };

      // available to hardware blocks
      easy.showBaseSettings(that, settings);

      // Custom settings definition
      settings.Custom.Sensitivity = {
        property: 'Custom.Sensitivity',
        items: [
          {name: "7", value: 7, selected: settings.Custom.Sensitivity == 7?true:false},
          {name: "6", value: 6, selected: settings.Custom.Sensitivity == 6?true:false},
          {name: "5", value: 5, selected: settings.Custom.Sensitivity == 5?true:false},
          {name: "4", value: 4, selected: settings.Custom.Sensitivity == 4?true:false},
          {name: "3", value: 3, selected: settings.Custom.Sensitivity == 3?true:false},
          {name: "2", value: 2, selected: settings.Custom.Sensitivity == 2?true:false},
          {name: "1", value: 1, selected: settings.Custom.Sensitivity == 1?true:false},
          {name: "0", value: 0, selected: settings.Custom.Sensitivity == 0?true:false}
        ]
      };

      settings.Custom.Distance = {
        property: 'Custom.Distance',
        items: [
          {name: "0", value: 7, selected: settings.Custom.Distance == 7?true:false},
          {name: "1", value: 6, selected: settings.Custom.Distance == 6?true:false},
          {name: "2", value: 5, selected: settings.Custom.Distance == 5?true:false},
          {name: "3", value: 4, selected: settings.Custom.Distance == 4?true:false},
          {name: "4", value: 3, selected: settings.Custom.Distance == 3?true:false},
          {name: "5", value: 2, selected: settings.Custom.Distance == 2?true:false},
          {name: "6", value: 1, selected: settings.Custom.Distance == 1?true:false},
          {name: "7", value: 0, selected: settings.Custom.Distance == 0?true:false}
        ]
      };

      settings.Custom.SamplingRate = {
        property: 'Custom.SamplingRate',
        items: [
          {name: "1", value: 1, selected: settings.Custom.SamplingRate == 1?true:false},
          {name: "10", value: 10, selected: settings.Custom.SamplingRate == 10?true:false},
          {name: "20", value: 20, selected: settings.Custom.SamplingRate == 20?true:false},
          {name: "30", value: 30, selected: settings.Custom.SamplingRate == 30?true:false},
          {name: "40", value: 40, selected: settings.Custom.SamplingRate == 40?true:false},
          {name: "50", value: 50, selected: settings.Custom.SamplingRate == 50?true:false},
          {name: "60", value: 60, selected: settings.Custom.SamplingRate == 60?true:false},
          {name: "70", value: 70, selected: settings.Custom.SamplingRate == 70?true:false},
          {name: "80", value: 80, selected: settings.Custom.SamplingRate == 80?true:false},
          {name: "90", value: 90, selected: settings.Custom.SamplingRate == 90?true:false},
          {name: "100", value: 100, selected: settings.Custom.SamplingRate == 100?true:false}
        ]
      };

      // Select default selected item
      settings.Custom.Sensitivity.items.some(function(item){
        if(item.selected == true){
          settings.Custom.Sensitivity.default = item.name;
          return true;
        }
      });

      settings.Custom.Distance.items.some(function(item){
        if(item.selected == true){
          settings.Custom.Distance.default = item.name;
          return true;
        }
      });

      settings.Custom.SamplingRate.items.some(function(item){
        if(item.selected == true){
          settings.Custom.SamplingRate.default = item.name;
          return true;
        }
      });


      settings.Custom.ButtonMonitor = {
        property: 'Custom.ButtonMonitor',
        items: [
          {name: "A", value: 1, selected: settings.Custom.ButtonMonitor & 1?true:false},
          {name: "B", value: 2, selected: settings.Custom.ButtonMonitor & 2?true:false},
          {name: "C", value: 4, selected: settings.Custom.ButtonMonitor & 4?true:false},
        ]
      };

      settings.Custom.AwakeByTouch = {
        property: 'Custom.AwakeByTouch',
        items: [
          {name: "AwakeByTouch", value: 1, selected: settings.Custom.AwakeByTouch & 1?true:false},
        ]
      };


      // Render the template
      var html = $(that.propTemplate(settings.Custom));
      // Init Semantic-UI components
      html.find(".checkbox").checkbox();
      html.find(".dropdown").dropdown();

      // Display elements
      easy.displayCustomSettings(html);

    }).catch(function(err){
      console.log("Error reading settings: ", err);
    });
  };

  /**
   * Parent is send new data (using outputs).
   */
  Touch.onNewData = function() {};

  // Returns the current value of my inputs
  // Touch.onRead = function(){};

  // Optional event handlers
  Touch.onMouseOver = function(){
    // console.log("Mouse Over on ", myself.canvasIcon.id, evt);
  };

  /**
   * A copy has been dropped on the canvas.
   * I need to keep a copy of the processor to be triggered when
   * new data arrives.
   */
  Touch.onAddedtoCanvas = function(){};

  return Touch;
});
