import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { HotelService } from "../../services/hotel.service";

@Component({
  standalone: true,
  selector: "app-view-hotel",
  styleUrl: "./view-hotel.component.scss",
  templateUrl: "./view-hotel.component.html",
  imports: [CommonModule, RouterModule],
})
export class ViewHotelComponent implements OnInit {
  hotel: any;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private hotelService = inject(HotelService);

  ngOnInit(): void {
    const hotelId = this.route.snapshot.paramMap.get("id");
    if (hotelId) {
      this.loadHotelDetails(hotelId);
    }
  }

  loadHotelDetails(hotelId: string): void {
    this.hotelService.getHotelDetails(hotelId).subscribe((data: any) => {
      this.hotel = data;
    });
  }

  bookHotel(): void {
    if (this.hotel?._id) {
      this.router.navigate(["/book-hotel", this.hotel._id]);
    }
  }

  backToSearch(): void {
    this.router.navigate(["/profile"]);
  }
} 