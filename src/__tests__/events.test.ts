import request from "supertest";
import { type Express } from "express";
import { createApp } from "../app";

describe("events", () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  describe("get event by id route", () => {
    describe("given the event does not exist ", () => {
      it("should return 404", async () => {
        const eventId = "eventId";
        await request(app).get(`/app/v0/events/${eventId}`).expect(404);
      });
    });
    describe("given the event exists", () => {
      it("should return 200", async () => {
        const eventId = "9cc47087-4231-4089-abed-a594c47c28db";
        const response = await request(app).get(`/app/v0/events/${eventId}`);
        console.log(response.body);
        expect(response.status).toBe(200);
      });
    });
  });
});
