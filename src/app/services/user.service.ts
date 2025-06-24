import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = 'https://jsonplaceholder.typicode.com/users';

  constructor(
    private http: HttpClient
  ) {}

  // Función para consultar los usuarios
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL).pipe(
      catchError(this.handleError)
    );
  }

  // Función para consultar un usuario por ID
  getUserById(id: number): Observable<User> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<User>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Función para manejar errores del cliente o del servidor en todo el proyecto
  private handleError(error: any) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }

    console.error('Error en UserService:', errorMessage);
    console.log(error);

    return throwError(() => new Error('Algo salió mal al obtener los datos. Por favor, comunícate con el administrador.'));
  }
}
