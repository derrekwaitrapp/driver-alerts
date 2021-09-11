io.sails.reconnection = true;

io.socket.on(`geolocation`, (res)=>{
  const geoLocation = res.data;
  console.log(geoLocation);
  if(geoLocation.description != ``) alertDialog(`Geo Location:`, geoLocation.description, `success`);
  alertDialog(`Geo Location:`, geoLocation.coordinates, `info`);
});

io.socket.on(`alert`, (res)=>{
  const alert = res.data;
  console.log(alert);
  alertDialog(`Driver Alert:`, alert.description);
  ConfirmDialog(alert);
});

const driverId = 1;

io.socket.on(`connect`, ()=>{

  io.socket.get(`/geolocation?sort="id DESC"`, (geoLocations)=> {
    geoLocations.reverse();
    console.log(geoLocations);
    for(const geoLocation of geoLocations){
      if(geoLocation.description != ``) alertDialog(`Geo Location:`, geoLocation.description, `success`);
      alertDialog(`Geo Location:`, geoLocation.coordinates, `info`);
    }
  });

  io.socket.get(`/alert?driver=${driverId}&responded=false`, (alerts)=>{
    for(const alert of alerts){
      ConfirmDialog(alert);
      alertDialog(`Unacknowledged Driver Alert:`, alert.description);
    }
  });

});

// io.socket.on(`driver`, console.log);
// io.socket.get(`/driver`, console.log);

function alertDialog(title, message, type = `warning`){
  $('#driver_updates').prepend(`
    <div class="alert alert-${type} alert-dismissible fade show"  role="alert">
      <strong>${title}</strong> ${message}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `);
  // `).animate({
  //   scrollTop: $("#driver_updates").offset().top
  // },500);

}

function ConfirmDialog(alert) {
  console.log(alert);
  $('<div></div>').appendTo('body').html('<div><h6>' + alert.description + '</h6></div>')
    .dialog({
      modal: true,
      title: 'Driver Alert',
      zIndex: 10000,
      autoOpen: true,
      width: 'auto',
      resizable: false,
      buttons: {
        "I Understand": function() {
          console.log(alert.description)
          io.socket.patch(`/alert/${alert.id}`, {responded: true}, console.log);
          // io.socket.delete(`/alert/${alert.id}`, console.log);
          $(this).remove();
        }
      },
      close: function(event, ui) {
        io.socket.delete(`/alert/${alert.id}`, console.log);
        $(this).remove();
      }
    });
};

// Initialize and add the map
function initMap() {
  // The location of Uluru
  const uluru = { lat: 36.071598236853646, lng: -115.18793044285627 };
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: uluru,
  });
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: uluru,
    map: map,
  });
}
