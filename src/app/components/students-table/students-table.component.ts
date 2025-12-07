import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { StudentsService } from '../../services/students.service';
import { CommonModule } from '@angular/common';

export interface Student {
  id: string;
  name: string;
  address: string;
  class: string;
  fatherName: string;
  motherName: string;
}

@Component({
  selector: 'app-students-table',
  standalone: true,
  templateUrl: './students-table.component.html',
  styleUrls: ['./students-table.component.scss'],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    NgxSkeletonLoaderModule,
    CommonModule
  ],
})
export class StudentsTableComponent implements OnInit, AfterViewInit {
  constructor(private studentService: StudentsService) { }
  displayedColumns: string[] = [
    'Id',
    'Name',
    'Address',
    'Class',
    'Father Name',
    'Mother Name',
  ];
  private loadStartTime = 0;
  private loaderMinimumTime = 500;
  private loaderEndDelay = 100;
  private searchDebounceTimer: any;

  students = new MatTableDataSource<Student>([]);
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;

  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  search = '';

  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadStudents()
  }

  ngAfterViewInit(): void {
    this.students.paginator = this.paginator;
    this.students.sort = this.sort;

    this.students.filterPredicate = (data: Student, filter: string) => {
      const text =
        (data.id +
          ' ' +
          data.name +
          ' ' +
          data.address +
          ' ' +
          data.class +
          ' ' +
          data.fatherName +
          ' ' +
          data.motherName)
          .toLowerCase()
          .trim();

      return text.includes(filter);
    };
  }

  loadStudents() {
    this.loading = true;
    this.loadStartTime = Date.now();

    this.studentService
      .getStudents({
        page: this.pageIndex + 1,
        limit: this.pageSize,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
        search: this.search,
      })
      .subscribe({
        next: (res) => {
          this.students.data = res.data;
          this.totalItems = res.pagination.total;
          this.pageSize = res.pagination.limit;
          this.pageIndex = res.pagination.page - 1;
          const now = Date.now();
          const elapsed = now - this.loadStartTime;

          if (elapsed < this.loaderMinimumTime) {
            const remaining = this.loaderMinimumTime - elapsed;
            setTimeout(() => {
              setTimeout(() => (this.loading = false), this.loaderEndDelay);
            }, remaining);
          } else {
            this.loading = false;
          }
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onSearch(value: string) {
    this.pageIndex = 0;

    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    this.searchDebounceTimer = setTimeout(() => {
      this.search = value.trim();
      this.loadStudents();
    }, 500);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadStudents();
  }

  onSortChange(sort: Sort) {
    this.sortBy = sort.active.charAt(0).toLowerCase() + sort.active.slice(1).split(' ').join('') || 'name';
    this.sortOrder = sort.direction === 'desc' ? 'desc' : 'asc';
    this.loadStudents();
  }

  getFormattedPropertyName(columnName: string): string {
    const words = columnName.split(' ');
    return words
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('');
  }

}
