import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import axios from "axios";

import WayPoint from "../component/WayPoint";

describe("WayPoint test", () => {
  test("when search any query then should request", async () => {
    render(
      <WayPoint label={"waypoint"} onChange={jest.fn()} testId="waypoint" />
    );

    const axiosSpy = jest.spyOn(axios, "get");

    const input = within(screen.getAllByTestId("waypoint")[0]).getByRole(
      "combobox"
    );
    fireEvent.change(input, { target: { value: "any" } });
    await waitFor(() => screen.findByRole("listbox"), { timeout: 5000 });

    expect(axiosSpy).toBeCalledTimes(1);

    axiosSpy.mockRestore();
  });

  test("when click any result then should emit onChange", async () => {
    const onChange = jest.fn();
    render(
      <WayPoint label={"waypoint"} onChange={onChange} testId="waypoint" />
    );

    const waypointInput = within(
      screen.getAllByTestId("waypoint")[0]
    ).getByRole("combobox");
    fireEvent.change(waypointInput, { target: { value: "Stadtallendorf" } });
    const waypointListbox = await waitFor(() => screen.findByRole("listbox"), {
      timeout: 5000,
    });
    const waypointSuggestion = await within(waypointListbox).findByText(
      "Stadtallendorf"
    );
    fireEvent.click(waypointSuggestion);

    expect(onChange.mock.calls[0][0].id).toEqual("8005661");
  });
});
