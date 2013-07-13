describe("converters", function () {
    describe("date", function () {
        var areEqual = valerie.utils.areEqual,
            converter = valerie.converters.date;

        describe("parse", function () {
            it("should parse these day-month-year strings as dates", function () {
                converter.monthBeforeDate = false;
                expect(areEqual(converter.parse("29-02-1996"), new Date(1996, 1, 29))).toBeTruthy();
                expect(areEqual(converter.parse("01-01-2013"), new Date(2013, 0, 1))).toBeTruthy();
                expect(areEqual(converter.parse("1-1-2013"), new Date(2013, 0, 1))).toBeTruthy();
                expect(areEqual(converter.parse("31/12/2013"), new Date(2013, 11, 31))).toBeTruthy();
                expect(areEqual(converter.parse("1.1.1971"), new Date(1971, 0, 1))).toBeTruthy();
                expect(areEqual(converter.parse("30.11.1971"), new Date(1971, 10, 30))).toBeTruthy();
            });

            it("should parse these month-day-year strings as dates", function () {
                converter.monthBeforeDate = true;
                expect(areEqual(converter.parse("02-29-1996"), new Date(1996, 1, 29))).toBeTruthy();
                expect(areEqual(converter.parse("01-01-2013"), new Date(2013, 0, 1))).toBeTruthy();
                expect(areEqual(converter.parse("1-1-2013"), new Date(2013, 0, 1))).toBeTruthy();
                expect(areEqual(converter.parse("12/31/2013"), new Date(2013, 11, 31))).toBeTruthy();
                expect(areEqual(converter.parse("1.1.1971"), new Date(1971, 0, 1))).toBeTruthy();
                expect(areEqual(converter.parse("11.30.1971"), new Date(1971, 10, 30))).toBeTruthy();
            });

            it("should not parse these day-month-year strings as dates", function () {
                converter.monthBeforeDate = false;
                expect(converter.parse(null)).toBeNull();
                expect(converter.parse("")).toBeNull();
                expect(converter.parse("29/02/2013")).toBeNull();
                expect(converter.parse("30/02/2013")).toBeNull();
                expect(converter.parse("02/29/2013")).toBeNull();
                expect(converter.parse("01_01_2013")).toBeNull();
            });

            it("should not parse these month-day-year strings as dates", function () {
                converter.monthBeforeDate = true;
                expect(converter.parse(null)).toBeNull();
                expect(converter.parse("")).toBeNull();
                expect(converter.parse("02/29/2013")).toBeNull();
                expect(converter.parse("02/30/2013")).toBeNull();
                expect(converter.parse("29/02/2013")).toBeNull();
                expect(converter.parse("01_01_2013")).toBeNull();
            });
        });

        describe("format", function () {
            it("should format these dates correctly for day-month-year", function () {
                converter.monthBeforeDate = false;
                expect(converter.format(new Date(2013, 0, 1))).toEqual("01/01/2013");
                expect(converter.format(new Date(1996, 1, 29))).toEqual("29/02/1996");
            });

            it("should format these dates correctly for month-day-year", function () {
                converter.monthBeforeDate = true;
                expect(converter.format(new Date(2013, 0, 1))).toEqual("01/01/2013");
                expect(converter.format(new Date(1996, 1, 29))).toEqual("02/29/1996");
            });
        });
    });
    describe("currencyMajor", function () {
        var converter = valerie.converters.currencyMajor;

        describe("parse", function () {
            it("should parse these currency strings into floats", function () {
                expect(converter.parse("1")).toEqual(1);
                expect(converter.parse("£1")).toEqual(1);
                expect(converter.parse("1999")).toEqual(1999);
                expect(converter.parse("£1999")).toEqual(1999);
                expect(converter.parse("1,999")).toEqual(1999);
                expect(converter.parse("£1,999")).toEqual(1999);
            });

            it("should not parse these currency strings into floats", function () {
                expect(converter.parse("1.")).toBeNull();
                expect(converter.parse("1.00")).toBeNull();
                expect(converter.parse("£1.")).toBeNull();
                expect(converter.parse("£1.00")).toBeNull();
            });
        });

        describe("format", function () {
            it("should format these floats correctly as currency strings", function () {
                expect(converter.format(1)).toEqual("1");
                expect(converter.format(1, "C")).toEqual("£1");
                expect(converter.format(1, "C.")).toEqual("£1");
                expect(converter.format(1, "C.c")).toEqual("£1.00");
                expect(converter.format(1, "C.3")).toEqual("£1.000");
                expect(converter.format(1999, "C,")).toEqual("£1,999");
                expect(converter.format(1999, "C.c")).toEqual("£1999.00");
                expect(converter.format(1999, "C,.c")).toEqual("£1,999.00");
                expect(converter.format(1999, "C,.4")).toEqual("£1,999.0000");
            });
        });
    });
    describe("currencyMajorMinor", function () {
        var converter = valerie.converters.currencyMajorMinor;

        describe("parse", function () {
            it("should parse these currency strings into floats", function () {
                expect(converter.parse("1")).toEqual(1);
                expect(converter.parse("£1")).toEqual(1);
                expect(converter.parse("1.00")).toEqual(1);
                expect(converter.parse("£1.00")).toEqual(1);
                expect(converter.parse("1.50")).toEqual(1.5);
                expect(converter.parse("£1.50")).toEqual(1.5);
                expect(converter.parse("1999")).toEqual(1999);
                expect(converter.parse("£1999")).toEqual(1999);
                expect(converter.parse("1999.00")).toEqual(1999);
                expect(converter.parse("£1999.00")).toEqual(1999);
                expect(converter.parse("1999.50")).toEqual(1999.5);
                expect(converter.parse("£1999.50")).toEqual(1999.5);
                expect(converter.parse("1,999")).toEqual(1999);
                expect(converter.parse("£1,999")).toEqual(1999);
                expect(converter.parse("1,999.50")).toEqual(1999.5);
                expect(converter.parse("£1,999.50")).toEqual(1999.5);
            });

            it("should not parse these currency strings into floats", function () {
                expect(converter.parse("1.")).toBeNull();
                expect(converter.parse("1.000")).toBeNull();
                expect(converter.parse("£1.")).toBeNull();
                expect(converter.parse("£1.000")).toBeNull();
            });
        });

        describe("format", function () {
            it("should format these floats correctly as currency strings", function () {
                expect(converter.format(1)).toEqual("1");
                expect(converter.format(1, "C")).toEqual("£1");
                expect(converter.format(1, "C.")).toEqual("£1");
                expect(converter.format(1, "C.c")).toEqual("£1.00");
                expect(converter.format(1, "C.3")).toEqual("£1.000");
                expect(converter.format(1999, "C,")).toEqual("£1,999");
                expect(converter.format(1999, "C.c")).toEqual("£1999.00");
                expect(converter.format(1999.49, "C,")).toEqual("£1,999");
                expect(converter.format(1999.5, "C,")).toEqual("£2,000");
                expect(converter.format(1999.5, "C.c")).toEqual("£1999.50");
                expect(converter.format(1999.5, "C,.c")).toEqual("£1,999.50");
                expect(converter.format(1999.5, "C,.4")).toEqual("£1,999.5000");
            });
        });
    });
    describe("email", function () {
        var converter = valerie.converters.email;

        describe("parse", function () {
            it("should parse these strings as email addresses", function () {
                expect(converter.parse("a@b.com")).toEqual("a@b.com");
                expect(converter.parse("A@b.COM")).toEqual("a@b.com");
                expect(converter.parse("a@b.c.d.net")).toEqual("a@b.c.d.net");
                expect(converter.parse("E_jim.jones@b.c.d.net")).toEqual("e_jim.jones@b.c.d.net");
            });

            it("should not parse these strings as e-mail addresses", function () {
                expect(converter.parse(null)).toBeNull();
                expect(converter.parse("")).toBeNull();
                expect(converter.parse("@egrove")).toBeNull();
            });
        });

        describe("format", function () {
            it("should format these email addresses correctly", function () {
                expect(converter.format(null)).toEqual("");
                expect(converter.format("a@b.com")).toEqual("a@b.com");
            });
        });
    });
    describe("float", function () {
        var converter = valerie.converters.float;

        describe("parse", function () {
            it("should parse these strings into floats", function () {
                expect(converter.parse("1")).toEqual(1);
                expect(converter.parse("1.5")).toEqual(1.5);
                expect(converter.parse("1000")).toEqual(1000);
                expect(converter.parse("123.4567")).toEqual(123.4567);
            });

            it("should not parse these strings into floats", function () {
                expect(converter.parse(null)).toBeNull();
                expect(converter.parse("")).toBeNull();
                expect(converter.parse(" 1")).toBeNull();
                expect(converter.parse("a1.23")).toBeNull();
                expect(converter.parse("1.23a")).toBeNull();
            });
        });

        describe("format", function () {
            it("should format these floats correctly", function () {
                expect(converter.format(1)).toEqual("1");
                expect(converter.format(1.5)).toEqual("1.5");
                expect(converter.format(1000)).toEqual("1000");
                expect(converter.format(123.4567)).toEqual("123.4567");
            });
        });
    });

    describe("integer", function () {
        var converter = valerie.converters.integer;

        describe("parse", function () {
            it("should parse these strings into integers", function () {
                expect(converter.parse("1")).toEqual(1);
                expect(converter.parse("1000")).toEqual(1000);
                expect(converter.parse("1,000")).toEqual(1000);
            });

            it("should not parse these strings into integers", function () {
                expect(converter.parse(null)).toBeNull();
                expect(converter.parse("")).toBeNull();
                expect(converter.parse(" 1")).toBeNull();
                expect(converter.parse("1.23")).toBeNull();
                expect(converter.parse("1.23a")).toBeNull();
            });
        });

        describe("format", function () {
            it("should format these integers correctly", function () {
                expect(converter.format(1)).toEqual("1");
                expect(converter.format(1000)).toEqual("1000");
                expect(converter.format(1000, ",")).toEqual("1,000");
            });
        });
    });

    describe("number", function () {
        var converter = valerie.converters.number;

        describe("parse", function () {
            it("should parse these strings into numbers", function () {
                expect(converter.parse("1")).toEqual(1);
                expect(converter.parse("1000")).toEqual(1000);
                expect(converter.parse("1000.00")).toEqual(1000);
            });

            it("should not parse these strings into numbers", function () {
                expect(converter.parse(null)).toBeNull();
                expect(converter.parse("a1.23")).toBeNull();
                expect(converter.parse("1.23a")).toBeNull();
                expect(converter.parse("1,000")).toBeNull();
            });
        });

        describe("format", function () {
            it("should format these numbers correctly", function () {
                expect(converter.format(1)).toEqual("1");
                expect(converter.format(1000)).toEqual("1000");
                expect(converter.format(123.456)).toEqual("123.456");

            });
        });
    });
});