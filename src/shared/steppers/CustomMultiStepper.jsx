export default function CustomMultiStepper({
  steps = [],
  currentStep = 1,
  dataAuto,
}) {
  return (
    <ul data-auto={`container-${dataAuto}`} className="steps w-full ">
      {steps.map((step, index) => (
        <li
          data-auto={`step-${index + 1}-${dataAuto}`}
          onClick={() => step?.onCLickHandler()}
          role="button"
          key={index}
          data-content={currentStep > step?.serial ? "✓" : null}
          className={`step text-xs md:text-sm ${
            currentStep >= step?.serial ? "step-primary" : "step-custom"
          } `}
        >
          {step?.title}
        </li>
      ))}
    </ul>
  );
}

{
  /* <div className=" flex justify-center items-center mb-5 w-full md:w-1/2 ">
          <CustomMultiStepper
            steps={[
              {
                serial: 1,
                id: 1,
                title: "Fuel Station Details",
                onCLickHandler: () => {
                  setStep(1);
                },
              },
              {
                serial: 5,
                id: 5,
                title: "Schedule",
                onCLickHandler: () => {
                  if (validateForm()) {
                    setStep(2);
                  }
                },
              },
            ]}
            currentStep={step}
            dataAuto={`createAndUpdateFuelStation`}
          />
        </div> */
}
