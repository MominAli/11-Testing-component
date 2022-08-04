import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CounterApiService } from './counter-api.service';

const counter = 5;
const expectedURL = `/assets/counter.json?counter=${counter}`;
const serverResponse = {};

const errorEvent = new ErrorEvent('API error');

describe('CounterApiService', () => {
  let counterApiService: CounterApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CounterApiService],
    });

    counterApiService = TestBed.inject(CounterApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('saves the counter', () => {
    let actualResult: any;
    counterApiService.saveCounter(counter).subscribe((result) => {
      actualResult = result;
    });

    const request = httpMock.expectOne({ method: 'GET', url: expectedURL });
    request.flush(serverResponse);
    httpMock.verify();

    expect(actualResult).toBe(serverResponse);
  });

  it('handles save counter errors', () => {
    const status = 500;
    const statusText = 'Server error';

    let actualError: HttpErrorResponse | undefined;

    counterApiService.saveCounter(counter).subscribe(
      fail,
      (error: HttpErrorResponse) => {
        actualError = error;
      },
      fail,
    );

    const request = httpMock.expectOne({ method: 'GET', url: expectedURL });
    request.error(errorEvent, { status, statusText });
    httpMock.verify();

    if (!actualError) {
      throw new Error('actualError not defined');
    }
    expect(actualError.error).toBe(errorEvent);
    expect(actualError.status).toBe(status);
    expect(actualError.statusText).toBe(statusText);
  });
});
