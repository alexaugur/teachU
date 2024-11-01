import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import useMutationsRubrics from "@/hooks/use-mutations-rubrics";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Modal } from "./ui/modal";
import "../App.css";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const RubricManager = ({ questionId }) => {
  const [showModal, setShowModal] = useState(false);
  const [criteria, setCriteria] = useState("");
  const [score, setScore] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const { toast } = useToast();

  const rubrics = useStore((state) => state.rubrics[questionId] || []);
  const { loadRubrics, createRubric, removeRubric } = useMutationsRubrics();

  useEffect(() => {
    if (questionId && !isLoaded) {
      loadRubrics(questionId)
        .then(() => setIsLoaded(true))
        .catch((error) => console.error("Failed to load rubrics:", error));
    }
  }, [questionId, isLoaded, loadRubrics]);

  const handleAddRubricClick = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setCriteria("");
    setScore(1);
  };

  const handleSaveRubric = async () => {
    if (!criteria) {
      toast({
        variant: "destructive",
        title: "Criteria cannot be empty! 🙁",
        description: `Please re-enter your criteria`,
      });
      handleCloseModal();
      return;
    }
    if (score < 1) {
      toast({
        variant: "destructive",
        title: "Score must be positive number",
        description: `Please re-enter your criteria`,
      });
      handleCloseModal();
      return;


    }

    await createRubric(questionId, criteria, score);
    handleCloseModal();
  };

  const handleDeleteRubric = async (rubricId) => {
    await removeRubric(rubricId, questionId);
  };

  if (!questionId) {
    return null;
  }

  return (
    <div className="form">
      {rubrics.map((rubric) => (
        <div key={rubric.id} className="rubric">
          <div
            style={{
              fontSize: "14px",
              wordWrap: "break-word",
              marginBottom: "auto",
            }}
          >
            {rubric.criteria}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <span style={{ fontWeight: "bold" }}>{"/" + rubric.score}</span>
            <FontAwesomeIcon
              icon={faTrash}
              style={{
                cursor: "pointer",
                fontSize: "14px",
                marginLeft: "10px",
                color: "#E57373",
              }}
              onClick={() => handleDeleteRubric(rubric.id)}
            />
          </div>
        </div>
      ))}
      <div
        style={{ textAlign: "center", marginTop: "10px", marginBottom: "20px" }}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button
              aria-label={"Click to login"}
              variant="default"
              style={{ marginLeft: "2px", marginTop: "2px", width: "166px" }}
              onClick={handleAddRubricClick}
            >
              Add Rubric
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Rubric</DialogTitle>
              {/* <DialogDescription>
                Update the information here:
              </DialogDescription> */}
            </DialogHeader>
            <div className="grid gap-2 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="username" className="text-right">
                  Criteria
                </Label>
                <Input
                  id="criteria"
                  value={criteria}
                  className="col-span-3"
                  onChange={(e) => {
                    setCriteria(e.target.value);
                  }}
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="password" className="text-right">
                  Scale
                </Label>
                <Input
                  type="number"
                  id="score"
                  value={score}
                  className="col-span-3"
                  onChange={(e) => {
                    setScore(parseInt(e.target.value));
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant={"secondary"}
                  type="reset"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit" onClick={handleSaveRubric}>
                  Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* <button
          onClick={handleAddRubricClick}
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            color: "#E57373",
            fontSize: "16px",
          }}
          className="button"
        >
          Add Rubric
        </button> */}
      </div>
      {/* {showModal && (
        // @ts-ignore
        <Modal open={showModal} onClose={handleCloseModal}>
          <p className="text3 bottom-margin">Add New Rubric</p>
          <div className="flex bottom-margin">
            <p className="text1 right-margin">Criteria:</p>
            <Input
              // @ts-ignore
              label="criteria"
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
            />
          </div>
          <div className="flex bottom-margin">
            <p className="text1" style={{ marginRight: "15px" }}>
              Scale:
            </p>
            <Input
              type="number"
              // @ts-ignore
              label="Score"
              value={score}
              onChange={(e) => setScore(e.target.value)}
            ></Input>
          </div>

          <div className="flex">
            <button onClick={handleSaveRubric} className="button right-margin">
              Save
            </button>
            <button onClick={handleCloseModal} className="button">
              Cancel
            </button>
          </div>
        </Modal>
      )} */}
    </div>
  );
};

export default RubricManager;
