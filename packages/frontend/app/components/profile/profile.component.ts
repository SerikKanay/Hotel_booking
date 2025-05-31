import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HotelService } from "../../services/hotel.service";
import { BookingService } from "../../services/booking.service";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { catchError, of } from "rxjs";

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  firstName: string;
}

@Component({
  standalone: true,
  selector: "app-profile",
  styleUrl: "./profile.component.scss",
  templateUrl: "./profile.component.html",
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
})
export class ProfileComponent implements OnInit {
  term = new FormControl("");
  hotels: any[] = [];
  bookings: any[] = [];
  user: User | null = null;
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor(private hotelService: HotelService, private bookingService: BookingService) {}

  ngOnInit(): void {
    const user = this.authService.getUserFromStorage();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    if (user.isAdmin) {
      this.router.navigate(['/admin/profile']);
      return;
    }

    this.user = user;
    this.loadData();
  }

  private loadData(): void {
    this.getHotels();
    this.getBookings();
  }

  searchHotels(): void {
    const searchTerm = this.term.value || "";
    this.hotelService.searchHotels(searchTerm, 1, 10).subscribe(hotels => {
      this.hotels = hotels;
    });
  }

  getHotels(): void {
    this.hotelService.getHotels().subscribe(hotels => (this.hotels = hotels));
  }

  getBookings(): void {
    this.bookingService.getAllBookings().subscribe(bookings => (this.bookings = bookings));
  }

  cancelBooking(bookingId: string): void {
    this.bookingService.cancelBooking(bookingId).subscribe(() => {
      this.getBookings();
    });
  }
}
