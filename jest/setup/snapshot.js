// Provides access to jest-specific-snapshot custom jest matchers.

import { toMatchSpecificSnapshot } from "jest-specific-snapshot";

expect.extend(toMatchSpecificSnapshot);
