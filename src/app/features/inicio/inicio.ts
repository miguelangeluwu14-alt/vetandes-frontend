import {Component,inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../core/auth/auth-service';
@Component({selector:'app-inicio',imports:[RouterLink],templateUrl:'./inicio.html'})
export class Inicio {protected auth=inject(AuthService);}
