import { Component, OnInit } from "@angular/core";
import { IonSegment, IonSegmentButton } from "@ionic/angular";
import { AuthService } from "src/app/services/auth.service";
import { FriendService } from "src/app/services/friend.service";
import { UserService } from "src/app/services/user.service";
import { User } from "src/app/types/User";

@Component({
  selector: "app-friends",
  templateUrl: "./friends.page.html",
  styleUrls: ["./friends.page.scss"],
})
export class FriendsPage implements OnInit {
  showFriends = true;
  users: Array<User> = [];
  friends: Array<User> = [];
  filteredUsers: Array<User> = [];
  filteredFriends: Array<User> = [];

  searchTerm: string;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private friendService: FriendService
  ) {}

  ngOnInit() {
    this.friendService.getAllFriends().subscribe((data) => {
      this.friends = [];
      data.map((d) => {
        if (d.uid === this.authService.getUid()) return;
        this.friends.push({
          uid: d.uid,
          firstName: d.value.firstName,
          lastName: d.value.lastName,
          imageUrl: d.value.imageUrl,
        });
      });
      this.filteredFriends = this.friends;
    });

    this.userService.getAllUsers().subscribe((data) => {
      data.map((d) => {
        if (d.uid === this.authService.getUid() || this.isExist(d.uid)) return;
        this.users.push({
          uid: d.uid,
          firstName: d.value.firstName,
          lastName: d.value.lastName,
          imageUrl: d.value.imageUrl,
        });
      });
      this.filteredUsers = this.users;
    });
  }

  segmentChanged(event: CustomEvent) {
    switch (event.detail.value) {
      case "friends":
        this.showFriends = true;
        break;
      case "users":
        this.showFriends = false;
        break;
    }
  }

  isExist(uid) {
    for (let friend of this.friends) {
      if (friend.uid === uid) return true;
    }
    return false;
  }

  setFilteredItems() {
    if (!this.showFriends) {
      this.filteredUsers = this.users.filter(
        (user) =>
          user.firstName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >
            -1 ||
          user.lastName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >
            -1
      );
    } else {
      this.filteredFriends = this.friends.filter(
        (friend) =>
          friend.firstName
            .toLowerCase()
            .indexOf(this.searchTerm.toLowerCase()) > -1 ||
          friend.lastName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >
            -1
      );
    }
  }

  addFriend(user) {
    const { uid, firstName, lastName, imageUrl } = user;
    const data = {
      firstName,
      lastName,
      imageUrl,
    };

    this.users = this.users.filter((user) => user.uid !== uid);
    this.filteredUsers = this.users;

    this.friendService.addFriend(uid, data);
  }

  deleteFriend(user) {
    const { uid } = user;

    this.users.push(user);
    this.filteredUsers = this.users;

    this.friendService.deleteFriend(uid);
  }
}
