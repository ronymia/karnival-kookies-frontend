import { getAllFaqs } from "@/apis/faqs";
import FixedBgComponent from "@/Shared/FixedBgComponent";
import Heading from "@/Shared/Heading";
import TableComponentHeading from "@/Shared/TableComponentHeading";
import NavigateComponent from "@/Utils/navigate";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlinePhoneInTalk } from "react-icons/md";
import { TfiEmail } from "react-icons/tfi";
import ContactForm from "./ContactForm";
import SupportCard from "./SupportCard";

const page = async () => {
  const faqs = await getAllFaqs();
  console.log({ faqs });

  const supports = [
    {
      id: 1,
      name: "Email",
      icon: TfiEmail,
      contents: ["yDQ4W@example.com", "yDQ4W@example.com"],
    },
    {
      id: 2,
      name: "Phone",
      icon: MdOutlinePhoneInTalk,
      contents: ["0(800) 890-90-609", "0(800) 890-90-620"],
    },
    {
      id: 3,
      name: "Location",
      icon: CiLocationOn,
      contents: ["29 Nicolas str, New York, 987597-50"],
    },
  ];
  return (
    <div className={`space-y-20 pb-40`}>
      <FixedBgComponent
        url="/chocolate_bg.jpg"
        wrapperClass={`pt-60 pb-40`}
        component={
          <TableComponentHeading
            routes={
              <div className={`text-[14px]`}>
                <span className={`text-primary cursor-pointer`}>
                  <NavigateComponent text="Home" route="/" />
                </span>{" "}
                {"//"} <span>Contact us</span>
              </div>
            }
            heading={"Contacts"}
          />
        }
      />
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-5`}
      >
        {supports.map((support, i) => (
          <SupportCard
            key={support.id}
            support={support}
            index={i}
            length={supports?.length}
          />
        ))}
      </div>
      <div className={`max-w-screen-xl mx-auto px-5 space-y-5`}>
        <Heading isSubHeading={false} heading={"Get in touch"} />
        <ContactForm />
      </div>
      <div className={`max-w-screen-xl mx-auto px-5 space-y-5`}>
        <Heading isSubHeading={false} heading={"Frequently asked questions"} />
        {faqs?.data?.map((faq, i) => (
          <div key={i} className="join join-vertical w-full rounded-lg">
            <div className="collapse collapse-arrow join-item  border border-primary">
              <input type="checkbox" name="my-accordion-4" />
              <div className="collapse-title columns-lg font-bold text-primary">
                {faq?.question}
              </div>
              <div className="collapse-content">{faq?.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
