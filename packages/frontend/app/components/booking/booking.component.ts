import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { HotelService } from "../../services/hotel.service";
import { BookingService } from "../../services/booking.service";

@Component({
  standalone: true,
  selector: "app-booking",
  styleUrl: "./booking.component.scss",
  templateUrl: "./booking.component.html",
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
})
export class BookingComponent implements OnInit {
  hotel: any;
  confirmBooking = false;
  paymentForm!: FormGroup;
  hotelId: string | null = null;
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
  booking: any = null;
  options = [
    { name: "Suite", type: "Lake View" },
    { name: "Single Bed", type: "basic" },
    { name: "Double Bed", type: "basic" },
    { name: "Double Bed", type: "deluxe" },
    { name: "King Size Bed", type: "Maharaja" },
  ];
  years = [...Array(10).keys()].map(i => i + this.currentYear);
  months = [...Array(12).keys()].map(i => new Date(0, i).toLocaleString("en", { month: "long" }));
  private route = inject(ActivatedRoute);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private hotelService: HotelService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.hotelId = this.route.snapshot.paramMap.get("id");
    if (this.hotelId) {
      this.loadHotelDetails(this.hotelId);
    }
  }

  initForm(): void {
    this.paymentForm = this.fb.group({
      roomType: ["", Validators.required],
      checkInDate: ["", Validators.required],
      checkOutDate: ["", Validators.required],
      creditCardName: ["", Validators.required],
      year: [this.currentYear, Validators.required],
      month: [this.currentMonth, Validators.required],
      securityCode: ["", [Validators.required, Validators.pattern(/^\d{3}$/)]],
      creditCard: ["", [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(15), Validators.maxLength(19)]],
    });
  }

  loadHotelDetails(hotelId: string): void {
    this.hotelService.getHotelDetails(hotelId).subscribe((data: any) => {
      this.hotel = data;
    });
  }

  bookHotel(): void {
    if (this.paymentForm.valid && this.hotel?._id) {
      const formValue = this.paymentForm.value;
      const bookingData = {
        ...formValue,
        roomType: formValue.roomType.name,
        hotel: this.hotel._id,
      };
      this.bookingService.createBooking(bookingData).subscribe({
        next: () => {
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          console.error('Booking failed:', error);
        }
      });
    }
  }

  backToSearch(): void {
    this.router.navigate(["/profile"]);
  }

  proceed(): void {
    if (this.paymentForm.valid) {
      this.confirmBooking = true;
    }
  }
}
