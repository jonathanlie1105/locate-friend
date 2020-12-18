import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import {
  Camera,
  CameraResultType,
  CameraSource,
  Capacitor,
} from "@capacitor/core";
import { Platform } from "@ionic/angular";
import { DEFAULT_PROFILE_IMG } from "src/app/constants/default-image";
import { AppService } from "src/app/services/app.service";
import { AuthService } from "src/app/services/auth.service";
import { LocationService } from "src/app/services/location.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"],
})
export class SignupPage implements OnInit {
  @ViewChild("filePicker", { static: false })
  filePickerRef: ElementRef<HTMLInputElement>;
  photo: SafeResourceUrl = DEFAULT_PROFILE_IMG;
  isDesktop: boolean;
  validations_form: FormGroup;

  validation_messages = {
    email: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Enter a valid email." },
    ],
    password: [
      { type: "required", message: "Password is required." },
      {
        type: "minlength",
        message: "Password must be at least 5 characters long.",
      },
    ],
  };

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private userService: UserService,
    private locationService: LocationService,
    private formBuilder: FormBuilder,
    private platform: Platform,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      password: new FormControl(
        null,
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
      firstName: new FormControl("", Validators.compose([Validators.required])),
      lastName: new FormControl("", Validators.compose([Validators.required])),
    });

    if (
      (this.platform.is("mobile") && this.platform.is("hybrid")) ||
      this.platform.is("desktop")
    ) {
      this.isDesktop = true;
    }
  }

  async getPicture(type: string) {
    if (
      !Capacitor.isPluginAvailable("Camera") ||
      (this.isDesktop && type === "gallery")
    ) {
      this.filePickerRef.nativeElement.click();
      return;
    }

    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      saveToGallery: true,
    }).catch((err) => console.log(err));
    console.log(image);

    this.photo = image ? image.dataUrl : DEFAULT_PROFILE_IMG;
    console.log("this.photo: ", this.photo);
  }

  onFileChoose(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const pattern = /image-*/;
    const reader = new FileReader();
    console.log(event);

    if (!file.type.match(pattern)) {
      console.log("File format not supported");
      return;
    }

    reader.onload = () => {
      this.photo = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

  tryRegister(value) {
    this.appService.showLoadingIndicator();
    const data = { email: value.email, password: value.password };
    this.authService.signUp(data).then(
      (res) => {
        const { user } = res;
        const data = {
          firstName: value.firstName,
          lastName: value.lastName,
          imageUrl: this.photo,
        };
        this.userService.createUser(user.uid, data);
        this.locationService.createLocation(user.uid);
        this.appService.dismissLoadingIndicator();
        this.appService.toastSignUp();
      },
      (err) => {
        this.appService.dismissLoadingIndicator();
        console.log(err);
      }
    );
  }
}
