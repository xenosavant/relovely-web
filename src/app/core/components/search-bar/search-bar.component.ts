import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  public readonly placeholderText: string = 'Search products...';
  public placeholder: string;

  private category: string;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.placeholder = this.placeholderText;
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('category')) {
        this.category = params.get('category');
      } else {
        this.category = null;
      }
    });
  }

  public submit(searchTerm: string): void {
    if (searchTerm) {
      const params: string = this.parseInput(searchTerm);
      this.router.navigate(['/products'], {
        queryParams: { searchString: params }
      });
    }
  }

  private parseInput(input: string): string {
    return input.split(' ').reduce((result: string, value: string) => {
      return result + (!result ? '' : ',') + value;
    });
  }
}
