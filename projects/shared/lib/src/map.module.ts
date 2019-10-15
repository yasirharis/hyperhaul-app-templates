import {
    NgModule, Component, ViewChild, OnInit, Input,
    Directive, ElementRef, Output, EventEmitter
} from '@angular/core';

@Component({
    selector: 'googlemap',
    template: `<div #gmap style="width:100%;height:250px"></div>`
})
export class MapComponent implements OnInit {
    map: google.maps.Map

    @ViewChild('gmap') gmapElement: any
    @Input() latitude: any
    @Input() longitude: any

     initMap(gmapElement, lat, lng) {
        /**default singapore location */
        if (!lat) lat = 1.3521
        if (!lng) lng = 103.8198 
            this.map = new google.maps.Map(gmapElement.nativeElement, {
                center: new google.maps.LatLng(lat, lng),
                zoom: 12
            });
    }


    ngOnInit() {
        this.initMap(this.gmapElement, this.latitude, this.longitude) 
    }
}

@Directive({
    selector: '[google-place]'
})
export class GooglePlacesDirective implements OnInit {
    @Output() onSelect: EventEmitter<any> = new EventEmitter();
    private element: HTMLInputElement;
    public places: any;
    constructor(elRef: ElementRef) {
        this.element = elRef.nativeElement;
    }


    getFormattedAddress(place) {
        let location_obj = {};
        for (let i in place.address_components) {
            let item = place.address_components[i];

            location_obj['formatted_address'] = place.formatted_address;
            if (item['types'].indexOf("locality") > -1) {
                location_obj['locality'] = item['long_name']
            } else if (item['types'].indexOf("administrative_area_level_1") > -1) {
                location_obj['admin_area_l1'] = item['short_name']
            } else if (item['types'].indexOf("street_number") > -1) {
                location_obj['street_number'] = item['short_name']
            } else if (item['types'].indexOf("route") > -1) {
                location_obj['route'] = item['long_name']
            } else if (item['types'].indexOf("country") > -1) {
                location_obj['country'] = item['long_name']
            } else if (item['types'].indexOf("postal_code") > -1) {
                location_obj['postalCode'] = item['short_name']
            }

        }
        if (place.geometry.location.lat()) {
            location_obj['lat'] = place.geometry.location.lat()
        }
        if (place.geometry.location.lng()) {
            location_obj['lng'] = place.geometry.location.lng()
        }

        location_obj['placeId'] = place['place_id']
        return location_obj;
    }

    ngOnInit() { 
            let autocomplete = new google.maps.places.Autocomplete(this.element);
            // Specify country
            autocomplete.setComponentRestrictions(
                { 'country': ['sg', 'my', 'th', 'id', 'ph'] });
            google.maps.event.addListener(autocomplete, 'place_changed', () => {
                this.places = this.getFormattedAddress(autocomplete.getPlace())
                console.log('1:', this.places['placeId'])
                this.element.value = this.places['formatted_address']
            }); 
    }
}


@NgModule({
    declarations: [
        MapComponent, GooglePlacesDirective
    ],
    exports: [
        MapComponent, GooglePlacesDirective
    ]
})
export class MapModule { }