import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { FriendService } from "src/app/services/friend.service";
import { LocationService } from "src/app/services/location.service";

declare var google: any;

@Component({
  selector: "app-gmaps",
  templateUrl: "./gmaps.component.html",
  styleUrls: ["./gmaps.component.scss"],
})
export class GmapsComponent implements AfterViewInit {
  map: any;
  infoWindow: any = new google.maps.InfoWindow();
  marker: Array<any> = [];
  f_uids: Array<string> = [];
  @ViewChild("map", { read: ElementRef, static: false }) mapRef: ElementRef;

  constructor(
    private locationService: LocationService,
    private friendService: FriendService,
    private authService: AuthService
  ) {}

  ngAfterViewInit() {
    this.friendService.getAllFriends().subscribe((data) => {
      data.map((d) => {
        if (d.uid === this.authService.getUid()) return;
        this.f_uids.push(d.uid);
      });
      this.showMap();
    });
  }

  showMap() {
    this.locationService.getLocation().subscribe((data) => {
      const idxLat = data.findIndex((c) => c.key === "lat");
      const idxLng = data.findIndex((c) => c.key === "lng");

      const location = new google.maps.LatLng(
        data[idxLat].value,
        data[idxLng].value
      );
      const options = {
        center: location,
        zoom: 13,
        disableDefaultUI: true,
      };

      this.map = new google.maps.Map(this.mapRef.nativeElement, options);

      this.marker[0] = new google.maps.Marker({
        position: location,
        map: this.map,
      });
    });
    let i = 1;
    for (let f_uid of this.f_uids) {
      this.locationService.getLocationFriend(f_uid).subscribe((data) => {
        const idxLat = data.findIndex((c) => c.key === "lat");
        const idxLng = data.findIndex((c) => c.key === "lng");

        const location = new google.maps.LatLng(
          data[idxLat].value,
          data[idxLng].value
        );

        this.marker[i] = new google.maps.Marker({
          position: location,
          map: this.map,
        });
        i += 1;
      });
    }
    console.log(this.marker);
  }

  showCurrentLoc() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          time: position.timestamp,
        };
        this.locationService.updateLocation(pos);
        this.marker[0] = new google.maps.Marker({
          position: pos,
          map: this.map,
        });

        this.map.setCenter(pos);
      });
      let i = 1;
      for (let f_uid of this.f_uids) {
        this.locationService.getLocationFriend(f_uid).subscribe((data) => {
          const idxLat = data.findIndex((c) => c.key === "lat");
          const idxLng = data.findIndex((c) => c.key === "lng");

          const location = new google.maps.LatLng(
            data[idxLat].value,
            data[idxLng].value
          );

          this.marker[i] = new google.maps.Marker({
            position: location,
            map: this.map,
          });
          i += 1;
        });
      }
    }
    console.log(this.marker);
  }
}
