import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  studentArr: any[] = [];
  student: any = {
    studentId: 0,
    fullName: '',
    mobile: '',
    email: '',
  };
  sortedColumn: string = 'fullName'; // Initial sorting column
  sortDirection: string = 'asc'; // Initial sorting direction
  currentPage: number = 1;   // Current page number
  itemsPerPage: number = 5; // Number of items to display per page

  constructor() { }

  ngOnInit(): void {
    const localData = localStorage.getItem('studentList')
    if (localData != null) {
      this.studentArr = JSON.parse(localData);
    }
  }

  onAddStudent() {
    const notNull = document.getElementById('studentModel');
    if (notNull != null) {
      notNull.style.display = 'block';
    }
    this.student = {
      studentId: 0,
      fullName: '',
      mobile: '',
      email: '',
    };
  }

  onCloseModel() {
    const notNull = document.getElementById('studentModel');
    if (notNull != null) {
      notNull.style.display = 'none';
    }
  }

  onDelete(id: number) {
    for (let i = 0; i < this.studentArr.length; i++) {
      if (this.studentArr[i].studentId == id) {
        this.studentArr.splice(i, 1);
      }
    }
    localStorage.setItem('studentList', JSON.stringify(this.studentArr));
    alert('Student data deleted successfully');
  }

  onEdit(stud: any) {
    this.onAddStudent();
    this.student = stud;
  }

  saveStudent(data: any) {
    if (!this.isValidStudent(this.student)) {
      return;
    }

    this.student.studentId = this.studentArr.length + 1;
    this.studentArr.push(this.student);
    this.onCloseModel();
    localStorage.setItem('studentList', JSON.stringify(this.studentArr));
    this.student = {
      studentId: 0,
      fullName: '',
      mobile: '',
      email: '',
    };
  }

  onUpdate() {
    if (!this.isValidStudent(this.student)) {
      return;
    }

    const record = this.studentArr.find(m => m.studentId == this.student.studentId);
    record.fullName = this.student.fullName;
    record.mobile = this.student.mobile;
    record.email = this.student.email;
    localStorage.setItem('studentList', JSON.stringify(this.studentArr));
    this.onCloseModel();
  }

  onSort(column: string) {
    if (column === this.sortedColumn) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = column;
      this.sortDirection = 'asc';
    }

    this.studentArr.sort((a, b) => {

      if (this.sortDirection === 'asc') {

        //locleCompare for comparing strings
        return a[column].localeCompare(b[column]);
      } else {
        return b[column].localeCompare(a[column]);
      }
    });
  }

  // Validation function to check if the student data is valid
  isValidStudent(student: any): boolean {
    if (!student.fullName || !student.mobile || !student.email) {
      alert('Please fill in all required fields.');
      return false;
    }
    // Check Full Name format (only alphabetic characters and spaces)
    const fullNameCheck = /^[A-Za-z\s]+$/;
    if (!fullNameCheck.test(student.fullName)) {
      alert('Full Name should contain only alphabetic characters and spaces.');
      return false;
    }

    // Check Mobile format (numeric and optional hyphens or spaces)
    const mobileCheck = /^\d{10}$/;
    if (!mobileCheck.test(student.mobile)) {
      alert('Mobile should contain exactly 10 numeric digits.');
      return false;
    }

    // Check Email format
    const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailCheck.test(student.email)) {
      alert('Invalid email format. Please enter a valid email address.');
      return false;
    }

    return true;
  }

  // Calculate the total number of pages
  getTotalPages(): number {
    return Math.ceil(this.studentArr.length / this.itemsPerPage);
  }

  // Generate an array of page numbers
  getPages(): number[] {
    const totalPages = this.getTotalPages();
    return Array(totalPages).fill(0).map((x, i) => i + 1);
  }

  // Get the currently visible students for the current page
  getVisibleStudents(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.studentArr.slice(startIndex, endIndex);
  }

  // Pagination method to change the current page
  onPageChange(page: number) {
    this.currentPage = page;
  }
}
