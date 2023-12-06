import { setupServer } from "msw/node";
import { http } from "msw";

import { BASE_URL } from "../base";

export function createServer(handlers: any){
        
    const server = setupServer(...handlers)

    beforeAll(() => {
        server.listen()
    })
    afterEach(() => {
        server.resetHandlers() 
    })
    afterAll(() => {
        server.close()
    })
}