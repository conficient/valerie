describe("utils", function () {
    var complexModel = {
        "m-p1": ko.observable(25),
        "m-p2": ko.observable("Jim").validate().applicable(false).end(),
        "m-s1": {
            "m-s1-p1": ko.observable(new Date(2013, 1, 1)),
            "m-s1-s1": ko.observable({
                "m-s1-s1-p1": "Fred",
                "m-s1-s1-a1": [
                    "1",
                    "2",
                    {
                        "m1-s1-s1-a1-i3-p1": "One",
                        "m1-s1-s1-a1-i3-p2": ko.observable("Three")
                    }
                ]
            }).validate().applicable(false).end()
        }
    };

    describe("map", function () {
        it("should unwrap and include all properties by default", function () {
            var destinationModel = valerie.mapModel(complexModel);

            expect(JSON.stringify(destinationModel)).toBe(JSON.stringify({
                "m-p1": 25,
                "m-p2": "Jim",
                "m-s1": {
                    "m-s1-p1": new Date(2013, 1, 1),
                    "m-s1-s1": {
                        "m-s1-s1-p1": "Fred",
                        "m-s1-s1-a1": [
                            "1",
                            "2",
                            {
                                "m1-s1-s1-a1-i3-p1": "One",
                                "m1-s1-s1-a1-i3-p2": "Three"
                            }
                        ]
                    }
                }
            }));
        });
    });

    describe("mapApplicable", function () {
        it("should unwrap and include all applicable properties and sub-models", function () {
            var destinationModel = valerie.mapApplicableModel(complexModel);

            expect(JSON.stringify(destinationModel)).toBe(JSON.stringify({
                "m-p1": 25,
                "m-s1": {
                    "m-s1-p1": new Date(2013, 1, 1)
                }
            }));
        });
    });
});
