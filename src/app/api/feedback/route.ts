import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { rating, name, phone, staffExperience, comments } = data;

    // Validate required fields
    if (!rating || !name || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Path to the Excel file
    const filePath = path.join(process.cwd(), "feedback.xlsx");
    const workbook = new ExcelJS.Workbook();
    let worksheet;

    // Check if file exists
    if (fs.existsSync(filePath)) {
      await workbook.xlsx.readFile(filePath);
      worksheet = workbook.getWorksheet(1);
    } else {
      // Create new file with headers
      worksheet = workbook.addWorksheet("Feedback");
      worksheet.columns = [
        { header: "Timestamp", key: "timestamp", width: 25 },
        { header: "Name", key: "name", width: 20 },
        { header: "Phone", key: "phone", width: 15 },
        { header: "Staff Experience", key: "staffExperience", width: 30 },
        { header: "Rating", key: "rating", width: 10 },
        { header: "Comments", key: "comments", width: 50 },
      ];
      
      // Make headers bold
      worksheet.getRow(1).font = { bold: true };
    }

    if (!worksheet) {
        return NextResponse.json(
            { error: "Failed to initialize worksheet" },
            { status: 500 }
        );
    }

    // Append new row
    worksheet.addRow({
      timestamp: new Date().toLocaleString(),
      name,
      phone,
      staffExperience,
      rating,
      comments,
    });

    // Save to disk
    await workbook.xlsx.writeFile(filePath);

    return NextResponse.json({ success: true, message: "Feedback saved successfully" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
