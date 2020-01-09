import React from "react"
import { render, cleanup } from "react-testing-library"
import App from "./App"

afterEach(cleanup)

it("renders", () => {
  const { asFragment } = render(<App />)
  expect(asFragment()).toMatchSnapshot()
})