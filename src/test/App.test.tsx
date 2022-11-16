import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import App from "../App";

jest.setTimeout(15000);

describe("App tests", () => {
  test("renders when first open the App", () => {
    render(<App />);

    const journeys = screen.queryByTestId("journeys");
    expect(journeys).toBeNull();

    const startInput = within(screen.getAllByTestId("start")[0]).getByRole(
      "combobox"
    );
    const endInput = within(screen.getAllByTestId("end")[0]).getByRole(
      "combobox"
    );

    expect(startInput).toBeEmptyDOMElement();
    expect(endInput).toBeEmptyDOMElement();
  });

  test("when search any station then should see suggestion list", async () => {
    render(<App />);
    const stationName = "Stadtallendorf";

    const input = within(screen.getAllByTestId("start")[0]).getByRole(
      "combobox"
    );
    fireEvent.change(input, { target: { value: stationName } });

    const listbox = await waitFor(() => screen.findByRole("listbox"), {
      timeout: 5000,
    });
    const suggestion = await within(listbox).findByText(stationName);
    expect(suggestion).toBeInTheDocument();
  });

  test("if all inputs are filled then should see journeys", async () => {
    const { container } = render(<App test={true} />);

    const startInput = within(screen.getAllByTestId("start")[0]).getByRole(
      "combobox"
    );
    fireEvent.change(startInput, { target: { value: "Stadtallendorf" } });
    const startListbox = await waitFor(() => screen.findByRole("listbox"), {
      timeout: 5000,
    });
    const startSuggestion = await within(startListbox).findByText(
      "Stadtallendorf"
    );
    fireEvent.click(startSuggestion);

    waitFor(() => screen.getAllByTestId("end")[0]);

    const endInput = within(screen.getAllByTestId("end")[0]).getByRole(
      "combobox"
    );
    waitFor(() => endInput);
    fireEvent.change(endInput, { target: { value: "Munich" } });
    const endListbox = await waitFor(() => screen.findByRole("listbox"), {
      timeout: 5000,
    });
    const endSuggestion = await within(endListbox).findByText(
      "Munich (München)"
    );

    await waitFor(() => container.getElementsByClassName("leaflet-layer"));

    fireEvent.click(endSuggestion);

    const loading = await screen.findByTestId("loading");
    expect(loading).toBeInTheDocument();

    const journeys = await waitFor(() => screen.findByTestId("journeys"), {
      timeout: 5000,
    });
    expect(journeys).toBeInTheDocument();
    expect(loading).not.toBeInTheDocument();
  });
});
