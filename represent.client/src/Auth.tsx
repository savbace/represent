import { Button } from "@nextui-org/react";
import ConnectWithStrava from "./assets/btn_strava_connectwith_orange.svg";
import { useUser } from "./services/hooks";

export default function Auth() {
  const { user } = useUser();

  if (user) {
    return (
      <section>
        <p>
          Hello, <b>{user.name}</b>!
        </p>
        <form method="POST" action="/auth/signout">
          <Button type="submit" color="warning">
            Sign out
          </Button>
        </form>
      </section>
    );
  }

  return (
    <section>
      <form method="POST" action="/auth/signin">
        <Button type="submit" variant="solid" radius="none" className="h-fit w-fit bg-inherit p-0">
          <img src={ConnectWithStrava} />
        </Button>
      </form>
    </section>
  );
}
