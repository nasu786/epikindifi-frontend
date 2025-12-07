import { Component } from '@angular/core';
import { StudentsTableComponent } from './components/students-table/students-table.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [StudentsTableComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
