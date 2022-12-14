import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  public readonly placeholderText: string = 'Search';
  public placeholder: string;

  form: FormGroup = new FormGroup({
    term: new FormControl('')
  })

  @Input() mobile = false;

  @Output() search: EventEmitter<any> = new EventEmitter();
  @Output() term: EventEmitter<string> = new EventEmitter();

  constructor(private route: ActivatedRoute, private router: Router) {
    this.placeholder = this.placeholderText;
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const newTerm = params['search'];
      if (this.form.get('term').value !== newTerm) {
        this.form.get('term').setValue(newTerm);
      }
    })
  }

  onSearch() {
    this.search.emit();
  }


  public termChanged(event: any) {
    if (event.keyCode === 13) {
      this.search.emit();
    }
    this.term.emit(this.form.get('term').value);
  }
}
