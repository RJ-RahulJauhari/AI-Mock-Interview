import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <section className="bg-gray-50">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        {/* Content Section */}
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            {/* Logo */}
            <a className="block text-blue-600" href="/">
              <span className="sr-only">AI Learning Platform</span>
              <svg
                className="h-10"
                viewBox="0 0 28 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547Z"
                  fill="currentColor"
                />
              </svg>
            </a>

            {/* Header */}
            <h1 className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
              Learn AI with Ease
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-lg text-gray-600">
              Build skills with the help of Generative AI. Generate your own courses, take smart interviews and study with LLM's.
            </p>

            {/* Sign-In Button */}
            <div className="flex justify-center items-center mt-8 ">
              <SignIn />
            </div>
          </div>
        </main>

        {/* Image Section */}
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <div className="absolute inset-0 h-full w-full overflow-hidden">
            <div className="absolute inset-y-0 right-0 w-full transform skew-x-12">
              <img
                alt="AI Learning Illustration"
                src="./logo.png"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
