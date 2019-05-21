$(document).on("mobileinit", function(){
    $(function(){

        var api = "5d1364d5d302c5f8434dbb6fcc38d2ce";
        var memoria = [];
        var nombre;
        if (localStorage.length == 0){
            localStorage.setItem("memoria", JSON.stringify(memoria));
        }

        //Recuperar datos de localStorage
        var recogedor = JSON.parse(localStorage.getItem("memoria"));
        //var largoCR = recogedor.length;
        //recorro el array para ir añadiendo las cajas de ciudades guardadas
        for (let i = 0; i < recogedor.length; i++) {
            $.getJSON("http://api.openweathermap.org/data/2.5/weather?q="+ recogedor [i] +"&appid=" + api + "&lang=es&units=metric", function(response){
                temperatura_g=response.main.temp;
                icono_g=response.weather[0].icon;
                iconosrc= "pictogramas/" + icono_g + ".png";
                var ciu_caja = '<div class="ciu"><a class="eliminar ui-btn">x</a><div class="ciu_todo"><div class="ciu_info"><h1 class="temp_d">'+ temperatura_g.toFixed() +'º</h1><h2 class="ubica_d"> '+recogedor [i]+' </h2></div><div class="ciu_img"><img class="icono_d" src="'+iconosrc+'" alt=""></div></div></div>';                          
                $("#mis_cius").append(ciu_caja);
                document.location.hash="#ciudades";
            });
        }

        //Permiso para la geolocalización
        $("#tiempito").on("pageinit", function(){
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(successF, errorF); 
            }
            else{
                alert("Este navegador no te geocaliza, humanx :(");
            }
        });

        //Datos de la página principal
        function successF (position){
            let latitud = position.coords.latitude;
            let longitud= position.coords.longitude;
            let n_ciudad;
            let temperatura;
            let humedad;
            let viento;
            let icono;
            let fecha = new Date();
                var mes = new Array ("emnero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre");
                var semana = new Array("Dom.","Lun.","Mar.","Mié.","Jue.","Vie.","Sáb.");
            $(".dia").html(semana[fecha.getDay()] + ", " + fecha.getDate() + " de " + mes[fecha.getMonth()]);
            $(".lat").html("Latitud: " + latitud.toFixed(2));
            $(".lon").html("Longitud: " + longitud.toFixed(2));

            $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + latitud + "&lon=" + longitud + "&appid=" + api + "&lang=es&units=metric", function(response){
                n_ciudad = response.name;
                temperatura = response.main.temp;
                humedad = response.main.humidity;
                viento = response.wind.speed;
                icono = response.weather[0].icon;
                iconosrc= "pictogramas/" + icono + ".png";

                $(".temp").html(temperatura.toFixed() + " º");
                $(".ubica").html(n_ciudad);
                $(".hum").html("Humedad: " + humedad + "%");
                $(".vie").html("Viento: " + viento + "m/s");
                $(".icono").attr("src", iconosrc);
            });
        }
    
        function errorF(){
            alert("Error D:");
        }


        //Búsqueda predictiva de ciudades
        $( "#autocomplete" ).on( "filterablebeforefilter", function ( e, data ) {
            var $ul = $( this ),
            $input = $( data.input ),
            value = $input.val(),
            html = "";

            if ( value && value.length > 2 ) {
                $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
                $ul.listview( "refresh" );
                $.ajax({
                    url: "http://gd.geobytes.com/AutoCompleteCity",
                    dataType: "jsonp",
                    crossDomain: true,
                    data: {
                        q: $input.val()
                    }
                })
                
                .then( function ( response ) {
                    $.each( response, function ( i, val ) {
                        html += "<li class='elem'>" + val + "</li>";
                    });
                
                    $ul.html( html );
                    $ul.listview( "refresh" );
                    $ul.trigger( "updatelayout");
                });
            }
        });

        //Seleccionar una ciudad y añadirla
        $( "#autocomplete" ).on( "click", ".elem" , function() {
            memoria = JSON.parse(localStorage.getItem("memoria")); 

            let seleccionar = $(this).html();
            var separar = seleccionar.split(",");
            nombre = separar[0];
            memoria.push(nombre);

            localStorage.setItem("memoria", JSON.stringify(memoria));


            $.getJSON("http://api.openweathermap.org/data/2.5/weather?q="+ nombre +"&appid=" + api + "&lang=es&units=metric", function(response){
                latitud_g=response.coord.lat;
                longitud_g=response.coord.lon;
                temperatura_g=response.main.temp;
                humedad_g=response.main.humidity;
                viento_g=response.wind.speed;
                icono_g=response.weather[0].icon;
                iconosrc= "pictogramas/" + icono_g + ".png";
                var ciu_caja = '<div class="ciu"><a class="eliminar ui-btn">x</a><div class="ciu_todo"><div class="ciu_info"><h1 class="temp_d">'+ temperatura_g.toFixed() +'º</h1><h2 class="ubica_d"> '+nombre+' </h2></div><div class="ciu_img"><img class="icono_d" src="'+iconosrc+'" alt=""></div></div></div>';                          
                $("#mis_cius").append(ciu_caja);
                document.location.hash="#ciudades";
            });
        });

        //Eliminar una ciudad
        $(document).on("click", ".eliminar", function(){
            $(this).parent().remove();
            memoria = JSON.parse(localStorage.getItem("memoria"));

            nombre=$(this).parent().html();

            let recortar= nombre.split(' ');
            nombre = recortar[7];
            alert(recortar);
            memoria= $.grep(memoria, function(value){
                return value != nombre;
                
            });
            
            localStorage.setItem("memoria", JSON.stringify(memoria));
        
        });


    });
});


