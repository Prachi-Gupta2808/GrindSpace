import { FocusCards } from "@/components/ui/focus-cards"; // Adjust path if needed

export default function ChooseProfile() {
  const cards = [
    {
      title: "Brain storming",
      src: "/card/1.jpg",
    },
    {
      title: "Over nighter?",
      src: "/card/2.jpg",
    },
    {
      title: "Can't code no more",
      src: "/card/3.jpg",
    },
    {
      title: "Gamer baby!",
      src: "/card/4.jpg",
    },
    {
      title: "Pink hues",
      src: "/card/5.jpg",
    },
    {
      title: "Over all this",
      src: "/card/6.jpg",
    },
  ];

  return (
    <div>
      <FocusCards cards={cards} />
    </div>
  );
}
