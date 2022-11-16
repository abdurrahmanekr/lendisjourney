import { render, screen } from "@testing-library/react";
import Direction from "../component/Direction";

describe("Direction test", () => {
  test("if not walking then should not see direction", async () => {
    render(
      <Direction
        distance={0}
        isWalking={false}
        label={"label-lorem-ipsum"}
        directionName="any direction"
      />
    );

    const label = screen.queryByText("label-lorem-ipsum");
    const directionName = screen.queryByText("(any direction Direction)");

    expect(label).toBeInTheDocument();
    expect(directionName).toBeInTheDocument();
  });

  test("if walking then should see only walking params", async () => {
    render(
      <Direction
        distance={300}
        isWalking={true}
        label={"label-lorem-ipsum"}
        directionName="directionName"
      />
    );

    const walk = screen.queryByText("Walk 0.30 km");
    const label = screen.queryByText("label-lorem-ipsum");
    const directionName = screen.queryByText("directionName");

    expect(walk).toBeInTheDocument();
    expect(directionName).not.toBeInTheDocument();
    expect(label).not.toBeInTheDocument();
  });
});
