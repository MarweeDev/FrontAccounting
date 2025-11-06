import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent {
  @Input() items: string[] = [];
  @Input() placeholder = 'Seleccione una opción';
  @Input() searchable = false;
  @Output() selectionChange = new EventEmitter<string>();

  isOpen = false;
  searchTerm = '';
  filteredItems: string[] = [];
  selectedItem: string | null = null;

  ngOnInit() {
    this.filteredItems = [...this.items];
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectItem(item: string) {
    this.selectedItem = item;
    this.isOpen = false;
    this.selectionChange.emit(item);
  }

  onSearchChange() {
    this.filteredItems = this.items.filter(item =>
      item.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.select-container')) {
      this.isOpen = false;
    }
  }
}
