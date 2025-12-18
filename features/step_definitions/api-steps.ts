import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { request, APIRequestContext, APIResponse } from '@playwright/test';

setDefaultTimeout(30000);

// World state to store context between steps
let apiContext: APIRequestContext;
let response: APIResponse;
let requestData: any = {};
let authToken: string;
let apiKey: string;
let basicAuthCredentials: { username: string; password: string };
let storedValues: Map<string, any> = new Map();

Before(async function () {
  apiContext = await request.newContext({
    baseURL: 'https://jsonplaceholder.typicode.com',
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  });
  requestData = {};
  storedValues.clear();
});

After(async function () {
  await apiContext.dispose();
});

// Background Steps
Given('the API base URL is {string}', function (url: string) {
  // Base URL is set in the Before hook, this step just validates it in scenarios
});

Given('the API supports multiple authentication methods', function () {
  // Setup step for authentication tests
});

// Authentication Steps
Given('I have a bearer token {string}', function (token: string) {
  authToken = token;
});

Given('I have an API key {string}', function (key: string) {
  apiKey = key;
});

Given('I have basic auth credentials {string} and {string}', function (username: string, password: string) {
  basicAuthCredentials = { username, password };
});

// Data Preparation Steps (shared for both post and update data)
Given('I have the following post data:', function (dataTable: any) {
  requestData = {};
  const rows = dataTable.rows();
  rows.forEach((row: string[]) => {
    const key = row[0];
    const value = row[1];
    requestData[key] = isNaN(Number(value)) ? value : Number(value);
  });
});

Given('I have the following update data:', function (dataTable: any) {
  requestData = {};
  const rows = dataTable.rows();
  rows.forEach((row: string[]) => {
    const key = row[0];
    const value = row[1];
    requestData[key] = isNaN(Number(value)) ? value : Number(value);
  });
});

// Request Steps
// NOTE: GET request with timing is now defined in Performance section below

When('I send a GET request to {string} with bearer authentication', async function (endpoint: string) {
  response = await apiContext.get(endpoint, {
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });
});

When('I send a GET request to {string} with API key in header', async function (endpoint: string) {
  response = await apiContext.get(endpoint, {
    headers: {
      'X-API-Key': apiKey,
    },
  });
});

When('I send a GET request to {string} with basic authentication', async function (endpoint: string) {
  const credentials = Buffer.from(`${basicAuthCredentials.username}:${basicAuthCredentials.password}`).toString('base64');
  response = await apiContext.get(endpoint, {
    headers: {
      'Authorization': `Basic ${credentials}`,
    },
  });
});

When('I send a POST request to {string} with the data', async function (endpoint: string) {
  response = await apiContext.post(endpoint, {
    data: requestData,
  });
});

When('I send a PUT request to {string} with the data', async function (endpoint: string) {
  response = await apiContext.put(endpoint, {
    data: requestData,
  });
});

When('I send a POST request to {string} with the data and bearer authentication', async function (endpoint: string) {
  response = await apiContext.post(endpoint, {
    data: requestData,
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });
});

When('I send a DELETE request to {string}', async function (endpoint: string) {
  response = await apiContext.delete(endpoint);
});

// Assertion Steps
Then('the response status code should be {int}', function (statusCode: number) {
  expect(response.status()).toBe(statusCode);
});

Then('the response should be a JSON array', async function () {
  const data = await response.json();
  expect(Array.isArray(data)).toBeTruthy();
});

Then('the response array should contain at least {int} item(s)', async function (count: number) {
  const data = await response.json();
  expect(data.length).toBeGreaterThanOrEqual(count);
});

Then('the response array should have at most {int} item(s)', async function (count: number) {
  const data = await response.json();
  expect(data.length).toBeLessThanOrEqual(count);
});

Then('each item should have property {string}', async function (property: string) {
  const data = await response.json();
  data.forEach((item: any) => {
    expect(item).toHaveProperty(property);
  });
});

Then('the response should have property {string}', async function (property: string) {
  const data = await response.json();
  expect(data).toHaveProperty(property);
});

Then('the response should have property {string} with value {int}', async function (property: string, value: number) {
  const data = await response.json();
  expect(data[property]).toBe(value);
});

Then('the response should have property {string} with value {string}', async function (property: string, value: string) {
  const data = await response.json();
  expect(data[property]).toBe(value);
});

Then('the response property {string} should have property {string}', async function (parentProperty: string, childProperty: string) {
  const data = await response.json();
  expect(data[parentProperty]).toHaveProperty(childProperty);
});

Then('the response property {string} should be a number', async function (property: string) {
  const data = await response.json();
  expect(typeof data[property]).toBe('number');
});

Then('the response property {string} should be a string', async function (property: string) {
  const data = await response.json();
  expect(typeof data[property]).toBe('string');
});

// Contract Validation Steps
Then('the response should have required fields:', async function (dataTable: any) {
  const data = await response.json();
  const fields = dataTable.rows().map((row: string[]) => row[0]);
  
  fields.forEach((field: string) => {
    expect(data).toHaveProperty(field);
  });
});

Then('the response field {string} should be of type {string}', async function (field: string, expectedType: string) {
  const data = await response.json();
  expect(typeof data[field]).toBe(expectedType);
});

Then('the response nested field {string} should exist', async function (fieldPath: string) {
  const data = await response.json();
  const parts = fieldPath.split('.');
  let current = data;
  
  for (const part of parts) {
    expect(current).toHaveProperty(part);
    current = current[part];
  }
});

Then('the response should be an array', async function () {
  const data = await response.json();
  expect(Array.isArray(data)).toBeTruthy();
});

Then('the response array should not be empty', async function () {
  const data = await response.json();
  expect(data.length).toBeGreaterThan(0);
});

Then('each array item should have required fields:', async function (dataTable: any) {
  const data = await response.json();
  const fields = dataTable.rows().map((row: string[]) => row[0]);
  
  data.forEach((item: any) => {
    fields.forEach((field: string) => {
      expect(item).toHaveProperty(field);
    });
  });
});

Then('the response field {string} should match email format', async function (field: string) {
  const data = await response.json();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  expect(emailRegex.test(data[field])).toBeTruthy();
});

Then('the response field {string} should be a non-empty string', async function (field: string) {
  const data = await response.json();
  expect(typeof data[field]).toBe('string');
  expect(data[field].length).toBeGreaterThan(0);
});

Then('the response field {string} should be a positive number', async function (field: string) {
  const data = await response.json();
  expect(typeof data[field]).toBe('number');
  expect(data[field]).toBeGreaterThan(0);
});

Then('the response field {string} should not be null', async function (field: string) {
  const data = await response.json();
  expect(data[field]).not.toBeNull();
  expect(data[field]).not.toBeUndefined();
});

Then('the response field {string} should have length greater than {int}', async function (field: string, minLength: number) {
  const data = await response.json();
  expect(data[field].length).toBeGreaterThan(minLength);
});

Then('I store the response field {string} as {string}', async function (field: string, varName: string) {
  const data = await response.json();
  storedValues.set(varName, data[field]);
});

Then('the response field {string} should equal stored value {string}', async function (field: string, varName: string) {
  const data = await response.json();
  const storedValue = storedValues.get(varName);
  expect(data[field]).toBe(storedValue);
});

Then('each array item should have field {string} of type {string}', async function (field: string, expectedType: string) {
  const data = await response.json();
  data.forEach((item: any) => {
    expect(typeof item[field]).toBe(expectedType);
  });
});

Then('each array item field {string} should be a positive number', async function (field: string) {
  const data = await response.json();
  data.forEach((item: any) => {
    expect(typeof item[field]).toBe('number');
    expect(item[field]).toBeGreaterThan(0);
  });
});

Then('the response should be valid JSON', async function () {
  const data = await response.json();
  expect(data).toBeDefined();
});

Then('the response should have at least {int} fields', async function (minFields: number) {
  const data = await response.json();
  const fieldCount = Object.keys(data).length;
  expect(fieldCount).toBeGreaterThanOrEqual(minFields);
});

// HTTP Protocol and Header Validation
Then('the response header {string} should contain {string}', async function (headerName: string, expectedValue: string) {
  const headers = response.headers();
  expect(headers[headerName.toLowerCase()]).toContain(expectedValue);
});

Then('the response should have header {string}', async function (headerName: string) {
  const headers = response.headers();
  expect(headers).toHaveProperty(headerName.toLowerCase());
});

When('I send a POST request to {string} with the data:', async function (endpoint: string, dataTable: any) {
  requestData = {};
  const rows = dataTable.rows();
  rows.forEach((row: string[]) => {
    const key = row[0];
    const value = row[1];
    requestData[key] = isNaN(Number(value)) ? value : Number(value);
  });
  
  response = await apiContext.post(endpoint, {
    data: requestData,
  });
});

When('I send a PUT request to {string} with the data:', async function (endpoint: string, dataTable: any) {
  requestData = {};
  const rows = dataTable.rows();
  rows.forEach((row: string[]) => {
    const key = row[0];
    const value = row[1];
    requestData[key] = isNaN(Number(value)) ? value : Number(value);
  });
  
  response = await apiContext.put(endpoint, {
    data: requestData,
  });
});

// Identity Validation
Then('each array item field {string} should be unique', async function (field: string) {
  const data = await response.json();
  const values = data.map((item: any) => item[field]);
  const uniqueValues = new Set(values);
  expect(uniqueValues.size).toBe(values.length);
});

Then('each array item should have valid foreign key {string} in resource {string}', async function (foreignKeyField: string, resourceEndpoint: string) {
  const data = await response.json();
  
  for (const item of data) {
    const foreignKeyValue = item[foreignKeyField];
    const checkResponse = await apiContext.get(`${resourceEndpoint}/${foreignKeyValue}`);
    expect(checkResponse.status()).toBe(200);
  }
});

// Sorting and Pagination
Then('the response array should be sorted by {string} in {string} order', async function (field: string, order: string) {
  const data = await response.json();
  
  for (let i = 0; i < data.length - 1; i++) {
    if (order === 'ascending') {
      expect(data[i][field]).toBeLessThanOrEqual(data[i + 1][field]);
    } else {
      expect(data[i][field]).toBeGreaterThanOrEqual(data[i + 1][field]);
    }
  }
});

Then('I store the last array item field {string} as {string}', async function (field: string, varName: string) {
  const data = await response.json();
  const lastItem = data[data.length - 1];
  storedValues.set(varName, lastItem[field]);
});

Then('the first array item field {string} should be greater than stored value {string}', async function (field: string, varName: string) {
  const data = await response.json();
  const firstItem = data[0];
  const storedValue = storedValues.get(varName);
  expect(firstItem[field]).toBeGreaterThan(storedValue);
});

Then('the response array should be empty', async function () {
  const data = await response.json();
  expect(data.length).toBe(0);
});

Then('I store all array item field {string} values as {string}', async function (field: string, varName: string) {
  const data = await response.json();
  const values = data.map((item: any) => item[field]);
  storedValues.set(varName, values);
});

Then('the array should not contain any stored {string} values', async function (varName: string) {
  const data = await response.json();
  const currentValues = data.map((item: any) => item.id);
  const storedArray = storedValues.get(varName) as any[];
  
  const intersection = currentValues.filter((value: any) => storedArray.includes(value));
  expect(intersection.length).toBe(0);
});

// Idempotency
Then('I store the entire response as {string}', async function (varName: string) {
  const data = await response.json();
  storedValues.set(varName, JSON.stringify(data));
});

Then('the response should match stored {string}', async function (varName: string) {
  const data = await response.json();
  const storedData = storedValues.get(varName);
  expect(JSON.stringify(data)).toBe(storedData);
});

When('I send {int} GET requests to {string}', async function (count: number, endpoint: string) {
  const responses = [];
  for (let i = 0; i < count; i++) {
    responses.push(await apiContext.get(endpoint));
  }
  storedValues.set('multipleResponses', responses);
});

Then('all responses should have status code {int}', async function (expectedStatus: number) {
  const responses = storedValues.get('multipleResponses') as any[];
  responses.forEach((res: any) => {
    expect(res.status()).toBe(expectedStatus);
  });
});

Then('all responses should have consistent data structure', async function () {
  const responses = storedValues.get('multipleResponses') as any[];
  const firstData = await responses[0].json();
  const firstKeys = Object.keys(firstData).sort();
  
  for (let i = 1; i < responses.length; i++) {
    const data = await responses[i].json();
    const keys = Object.keys(data).sort();
    expect(keys).toEqual(firstKeys);
  }
});

Then('I store the response array length as {string}', async function (varName: string) {
  const data = await response.json();
  storedValues.set(varName, data.length);
});

Then('the response array length should equal stored value {string}', async function (varName: string) {
  const data = await response.json();
  const storedLength = storedValues.get(varName);
  expect(data.length).toBe(storedLength);
});

// Performance
let requestStartTime: number;
let requestEndTime: number;

When('I send a GET request to {string}', async function (endpoint: string) {
  // Replace stored variables in endpoint like {storedUserId}
  let processedEndpoint = endpoint;
  storedValues.forEach((value, key) => {
    processedEndpoint = processedEndpoint.replace(`{${key}}`, value);
  });
  
  requestStartTime = Date.now();
  response = await apiContext.get(processedEndpoint);
  requestEndTime = Date.now();
});

Then('the response time should be less than {int} ms', async function (maxTime: number) {
  const responseTime = requestEndTime - requestStartTime;
  expect(responseTime).toBeLessThan(maxTime);
});

Then('the response payload size should be less than {int} KB', async function (maxSizeKB: number) {
  const responseBody = await response.text();
  const sizeInKB = Buffer.byteLength(responseBody, 'utf8') / 1024;
  expect(sizeInKB).toBeLessThan(maxSizeKB);
});

Then('I measure the response time as {string}', async function (varName: string) {
  const responseTime = requestEndTime - requestStartTime;
  storedValues.set(varName, responseTime);
});

Then('the response time should be within {int}% of {string}', async function (percentage: number, varName: string) {
  const currentTime = requestEndTime - requestStartTime;
  const baselineTime = storedValues.get(varName) as number;
  const maxAllowedTime = baselineTime * (percentage / 100);
  expect(currentTime).toBeLessThan(maxAllowedTime);
});

// Data Quality
Then('the response field {string} should not have leading whitespace', async function (field: string) {
  const data = await response.json();
  const value = data[field];
  expect(value).toBe(value.trimStart());
});

Then('the response field {string} should not have trailing whitespace', async function (field: string) {
  const data = await response.json();
  const value = data[field];
  expect(value).toBe(value.trimEnd());
});

Then('the response field {string} should not be an empty string', async function (field: string) {
  const data = await response.json();
  expect(data[field]).not.toBe('');
});

Then('the response field {string} should not contain spaces', async function (field: string) {
  const data = await response.json();
  expect(data[field]).not.toContain(' ');
});

Then('the response field {string} should not contain control characters', async function (field: string) {
  const data = await response.json();
  const value = data[field];
  // Control characters are \x00-\x08, \x0B-\x0C, \x0E-\x1F, \x7F (excluding \n \r \t which are \x09, \x0A, \x0D)
  const controlCharRegex = /[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/;
  expect(controlCharRegex.test(value)).toBe(false);
});

Then('each array item field {string} should be a non-empty string', async function (field: string) {
  const data = await response.json();
  data.forEach((item: any) => {
    expect(typeof item[field]).toBe('string');
    expect(item[field]).not.toBe('');
  });
});
