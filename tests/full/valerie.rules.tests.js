describe("rules", function () {
    var validationResultStates = valerie.ValidationResult.states;

    describe("ArrayLengthRule", function () {
        var Rule = valerie.rules.ArrayLength;

        describe("test", function () {
            it("should return a passed result when a minimum and maximum length are not specified", function () {
                expect(new Rule(null, null).test(null).state).toBe(validationResultStates.passed);
                expect(new Rule(null, null).test([]).state).toBe(validationResultStates.passed);
                expect(new Rule(null, null).test(["1"]).state).toBe(validationResultStates.passed);
                expect(new Rule(null, null).test(["1", "2", "3"]).state).toBe(validationResultStates.passed);
            });

            it("should return a passed result when the length of the array is >= the minimum", function () {
                expect(new Rule(2, null).test(["1", "2"]).state).toBe(validationResultStates.passed);
                expect(new Rule(2, null).test(["1", "2", "3"]).state).toBe(validationResultStates.passed);
            });

            it("should return a passed result when the length of the array is <= the maximum", function () {
                expect(new Rule(null, 3).test(["1", "2"]).state).toBe(validationResultStates.passed);
                expect(new Rule(null, 3).test(["1", "2", "3"]).state).toBe(validationResultStates.passed);
            });

            it("should return a failed result when the length of the array is < the minimum", function () {
                expect(new Rule(2, null).test(["1"]).state).toBe(validationResultStates.failed);
            });

            it("should return a failed result when the length of the array is > the maximum", function () {
                expect(new Rule(null, 3).test(["1", "2", "3", "4"]).state).toBe(validationResultStates.failed);
            });

            it("should work with functions as the minimumValue and maximumValue parameters", function () {
                expect(new Rule(function () {
                    return 2;
                }, null).test(["1", "2", "3"]).state).toBe(validationResultStates.passed);
                expect(new Rule(null, function () {
                    return 3;
                }).test(["1", "2"]).state).toBe(validationResultStates.passed);
            })
        });
    });

    describe("DuringRule", function () {
        var Rule = valerie.rules.During;

        describe("test", function () {
            it("should return a passed result when a minimum and maximum value are not specified", function () {
                expect(new Rule(null, null).test(null).state).toBe(validationResultStates.passed);
                expect(new Rule(null, null).test(new Date()).state).toBe(validationResultStates.passed);
                expect(new Rule(null, null).test(new Date(1970, 1, 1)).state).toBe(validationResultStates.passed);
                expect(new Rule(null, null).test(new Date(2099, 1, 1)).state).toBe(validationResultStates.passed);
            });

            var minimumDate = new Date(1980, 1, 2),
                maximumDate = new Date(2020, 1, 1),
                beforeMinimumDate = new Date(1980, 1, 1),
                afterMaximumDate = new Date(2020, 1, 2);

            it("should return a passed result when the value is >= the minimum", function () {
                expect(new Rule(minimumDate, null).test(minimumDate).state).toBe(validationResultStates.passed);
                expect(new Rule(minimumDate, null).test(maximumDate).state).toBe(validationResultStates.passed);
            });

            it("should return a passed result when the value is <= the maximum", function () {
                expect(new Rule(null, maximumDate).test(maximumDate).state).toBe(validationResultStates.passed);
                expect(new Rule(null, maximumDate).test(minimumDate).state).toBe(validationResultStates.passed);
            });

            it("should return a failed result when the value is < the minimum", function () {
                expect(new Rule(minimumDate, null).test(beforeMinimumDate).state).toBe(validationResultStates.failed);
            });

            it("should return a failed result when the value > the maximum", function () {
                expect(new Rule(null, maximumDate).test(afterMaximumDate).state).toBe(validationResultStates.failed);
            });

            it("should work with functions as the minimumValue and maximumValue parameters", function () {
                expect(new Rule(function () {
                    return minimumDate;
                }, null).test(maximumDate).state).toBe(validationResultStates.passed);
                expect(new Rule(null, function () {
                    return maximumDate;
                }).test(minimumDate).state).toBe(validationResultStates.passed);
            })
        });
    });

    describe("Expression", function () {
        var Rule = valerie.rules.Expression;

        describe("test", function () {
            it("should return a passed result when a value matches the regular expression", function () {
                expect(new Rule("abc\\d\\d\\d").test("abc123").state).toBe(validationResultStates.passed);
                expect(new Rule(/abc\d\d\d/i).test("ABC123").state).toBe(validationResultStates.passed);
            });

            it("should return a failed result for a null value", function () {
                expect(new Rule("abc\\d\\d\\d").test(null).state).toBe(validationResultStates.failed);
            });

            it("should return a failed result when a value doesn't match the regular expression", function () {
                expect(new Rule("abc\\d\\d\\d").test("XYZ123").state).toBe(validationResultStates.failed);
                expect(new Rule(/abc\d\d\d/i).test("xyz123").state).toBe(validationResultStates.failed);
            });

            it("should work with functions that return an expression string", function () {
                expect(new Rule(function () {
                    return "abc\\d\\d\\d";
                }).test("abc123").state).toBe(validationResultStates.passed);
            });

            it("should work with functions that return an expression", function () {
                expect(new Rule(function () {
                    return /abc\d\d\d/i;
                }).test("ABC123").state).toBe(validationResultStates.passed);
            });
        })
    });

    describe("Matches", function () {
        var Rule = valerie.rules.Matches,
            dateMatch = new Date(2001, 1, 1);

        describe("test", function () {
            it("should return a passed result when a value matches the permitted value", function () {
                expect(new Rule("match").test("match").state).toBe(validationResultStates.passed);
                expect(new Rule(10).test(10).state).toBe(validationResultStates.passed);
                expect(new Rule(dateMatch).test(new Date(2001, 1, 1)).state).toBe(validationResultStates.passed);
            });

            it("should return a failed result when a value does not match the permitted value", function () {
                expect(new Rule("match").test(null).state).toBe(validationResultStates.failed);
                expect(new Rule("match").test("games").state).toBe(validationResultStates.failed);
                expect(new Rule(10).test(11).state).toBe(validationResultStates.failed);
                expect(new Rule(dateMatch).test(new Date(2002, 1, 1)).state).toBe(validationResultStates.failed);
            });

            it("should work with a function returning the permitted value", function () {
                expect(new Rule(function () {
                    return "match";
                }).test("match").state).toBe(validationResultStates.passed);
            });
        })
    });

    describe("NoneOf", function () {
        var Rule = valerie.rules.NoneOf,
            forbiddenDate = new Date(2001, 1, 1);

        describe("test", function () {
            it("should return a passed result when a value matches none of the forbidden values", function () {
                expect(new Rule([1, 2, 3]).test(null).state).toBe(validationResultStates.passed);
                expect(new Rule([null, 1, 2, 3]).test(4).state).toBe(validationResultStates.passed);
                expect(new Rule([new Date(), forbiddenDate]).test(new Date(1970, 1, 1)).state).toBe(validationResultStates.passed);
            });

            it("should return a failed result when a value does not match one the permitted values", function () {
                expect(new Rule([null, 1, 2, 3]).test(null).state).toBe(validationResultStates.failed);
                expect(new Rule([1, 2, 3]).test(3).state).toBe(validationResultStates.failed);
                expect(new Rule([new Date(), forbiddenDate]).test(forbiddenDate).state).toBe(validationResultStates.failed);
            });

            it("should work with a function returning the forbidden values", function () {
                expect(new Rule(function () {
                    return [1, 2, 3];
                }).test(4).state).toBe(validationResultStates.passed);
            });
        })
    });

    describe("Not", function () {
        var Rule = valerie.rules.Not,
            forbiddenDate = new Date(2001, 1, 1);

        describe("test", function () {
            it("should return a passed result when a value isn't the forbidden value", function () {
                expect(new Rule(null).test("match").state).toBe(validationResultStates.passed);
                expect(new Rule("match").test(null).state).toBe(validationResultStates.passed);
                expect(new Rule("match").test("notmatch").state).toBe(validationResultStates.passed);
                expect(new Rule(10).test(11).state).toBe(validationResultStates.passed);
                expect(new Rule(forbiddenDate).test(new Date(2002, 1, 1)).state).toBe(validationResultStates.passed);
            });

            it("should return a failed result when a value does match the forbidden value", function () {
                expect(new Rule(null).test(null).state).toBe(validationResultStates.failed);
                expect(new Rule("match").test("match").state).toBe(validationResultStates.failed);
                expect(new Rule(10).test(10).state).toBe(validationResultStates.failed);
                expect(new Rule(forbiddenDate).test(new Date(2001, 1, 1)).state).toBe(validationResultStates.failed);
            });

            it("should work with a function returning the forbidden value", function () {
                expect(new Rule(function () {
                    return "match";
                }).test("notmatch").state).toBe(validationResultStates.passed);
            });
        })
    });

    describe("OneOf", function () {
        var Rule = valerie.rules.OneOf;

        describe("test", function () {
            it("should return a passed result when a value matches one of the permitted values", function () {
                expect(new Rule([null, 1, 2, 3]).test(null).state).toBe(validationResultStates.passed);
                expect(new Rule([null, 1, 2, 3]).test(1).state).toBe(validationResultStates.passed);
                expect(new Rule([null, 1, 2, 3]).test(2).state).toBe(validationResultStates.passed);
                expect(new Rule([null, 1, 2, 3]).test(3).state).toBe(validationResultStates.passed);
            });

            it("should return a failed result when a value does not match one the permitted values", function () {
                expect(new Rule([1, 2, 3]).test(null).state).toBe(validationResultStates.failed);
                expect(new Rule([1, 2, 3]).test(4).state).toBe(validationResultStates.failed);
            });

            it("should work with a function returning the permitted values", function () {
                expect(new Rule(function () {
                    return [1, 2, 3];
                }).test(2).state).toBe(validationResultStates.passed);
            });
        })
    });

    describe("RangeRule", function () {
        var Rule = valerie.rules.Range;

        describe("test", function () {
            it("should return a passed result when a minimum and maximum value are not specified", function () {
                expect(new Rule(null, null).test(null).state).toBe(validationResultStates.passed);
                expect(new Rule(null, null).test(1).state).toBe(validationResultStates.passed);
                expect(new Rule(null, null).test(-1).state).toBe(validationResultStates.passed);
                expect(new Rule(null, null).test(0).state).toBe(validationResultStates.passed);
                expect(new Rule(null, null).test(1000).state).toBe(validationResultStates.passed);
            });

            it("should return a passed result when the value is >= the minimum", function () {
                expect(new Rule(10, null).test(10).state).toBe(validationResultStates.passed);
                expect(new Rule(10, null).test(11).state).toBe(validationResultStates.passed);
            });

            it("should return a passed result when the value is <= the maximum", function () {
                expect(new Rule(null, 20).test(20).state).toBe(validationResultStates.passed);
                expect(new Rule(null, 20).test(19).state).toBe(validationResultStates.passed);
            });

            it("should return a failed result when the value is < the minimum", function () {
                expect(new Rule(10, null).test(9).state).toBe(validationResultStates.failed);
            });

            it("should return a failed result when the value is > the maximum", function () {
                expect(new Rule(null, 20).test(21).state).toBe(validationResultStates.failed);
            });

            it("should work with functions as the minimumValue and maximumValue parameters", function () {
                expect(new Rule(function () {
                    return 2;
                }, null).test(3).state).toBe(validationResultStates.passed);
                expect(new Rule(null, function () {
                    return 3;
                }).test(2).state).toBe(validationResultStates.passed);
            })
        });
    });

    describe("StringLengthRule", function () {
        var Rule = valerie.rules.StringLength;

        describe("test", function () {
            it("should return a passed result when a minimum and maximum length are not specified", function () {
                expect(new Rule(null, null).test(null).state).toBe(validationResultStates.passed);
                expect(new Rule(null, null).test("").state).toBe(validationResultStates.passed);
                expect(new Rule(null, null).test("1").state).toBe(validationResultStates.passed);
                expect(new Rule(null, null).test("1234567890").state).toBe(validationResultStates.passed);
            });

            it("should return a passed result when the length of the string is >= the minimum", function () {
                expect(new Rule(5, null).test("123456").state).toBe(validationResultStates.passed);
                expect(new Rule(5, null).test("12345").state).toBe(validationResultStates.passed);
            });

            it("should return a passed result when the length of the string is <= the maximum", function () {
                expect(new Rule(null, 5).test("12345").state).toBe(validationResultStates.passed);
                expect(new Rule(null, 5).test("1234").state).toBe(validationResultStates.passed);
            });

            it("should return a failed result when the length of the string is < the minimum", function () {
                expect(new Rule(5, null).test("1234").state).toBe(validationResultStates.failed);
            });

            it("should return a failed result when the length of the string is > the maximum", function () {
                expect(new Rule(null, 5).test("123456").state).toBe(validationResultStates.failed);
            });

            it("should work with functions as the minimumValue and maximumValue parameters", function () {
                expect(new Rule(function () {
                    return 5;
                }, null).test("123456").state).toBe(validationResultStates.passed);
                expect(new Rule(null, function () {
                    return 5;
                }).test("1234").state).toBe(validationResultStates.passed);
            })
        });
    });
});